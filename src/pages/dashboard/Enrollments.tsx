import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, Navigate } from "react-router-dom";
import { toast } from "sonner";
import {
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Search,
  XCircle,
} from "lucide-react";

import { enrollmentApi } from "@/api/enrollment.api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import type { ApiResponse, Enrollment, EnrollmentUpdateRequest } from "@/type";
import { EnrollmentStatus, PaymentStatus } from "@/type";

const paymentStatusLabels: Record<number, string> = {
  [PaymentStatus.Pending]: "Pending",
  [PaymentStatus.Completed]: "Completed",
  [PaymentStatus.Failed]: "Failed",
  [PaymentStatus.Refunded]: "Refunded",
};

const enrollmentStatusLabels: Record<number, string> = {
  [EnrollmentStatus.Active]: "Active",
  [EnrollmentStatus.Completed]: "Completed",
  [EnrollmentStatus.Cancelled]: "Cancelled",
  [EnrollmentStatus.Dropped]: "Dropped",
};

const formatDate = (value?: string) => {
  if (!value) return "Not set";

  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getPaymentBadgeClass = (status: number) => {
  switch (status) {
    case PaymentStatus.Completed:
      return "bg-emerald-100 text-emerald-700 hover:bg-emerald-100";
    case PaymentStatus.Failed:
      return "bg-red-100 text-red-700 hover:bg-red-100";
    case PaymentStatus.Refunded:
      return "bg-amber-100 text-amber-700 hover:bg-amber-100";
    default:
      return "bg-zinc-100 text-zinc-700 hover:bg-zinc-100";
  }
};

const getEnrollmentBadgeClass = (status: number) => {
  switch (status) {
    case EnrollmentStatus.Active:
      return "bg-blue-100 text-blue-700 hover:bg-blue-100";
    case EnrollmentStatus.Completed:
      return "bg-emerald-100 text-emerald-700 hover:bg-emerald-100";
    case EnrollmentStatus.Cancelled:
      return "bg-red-100 text-red-700 hover:bg-red-100";
    case EnrollmentStatus.Dropped:
      return "bg-amber-100 text-amber-700 hover:bg-amber-100";
    default:
      return "bg-zinc-100 text-zinc-700 hover:bg-zinc-100";
  }
};

export default function EnrollmentsPage() {
  const queryClient = useQueryClient();
  const { user, isAuthenticated, isAdmin } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeEnrollmentId, setActiveEnrollmentId] = useState<number | null>(
    null,
  );

  const { data: enrollmentsResponse, isLoading } = useQuery<
    ApiResponse<Enrollment[]>
  >({
    queryKey: ["enrollments", isAdmin ? "admin" : user?.id],
    queryFn: async () => {
      const response = isAdmin
        ? await enrollmentApi.getAll()
        : await enrollmentApi.getByUser(user!.id);

      return response.data;
    },
    enabled: isAuthenticated && !!user,
  });

  const enrollmentItems = enrollmentsResponse?.data ?? [];

  const filteredEnrollments = useMemo(() => {
    const search = searchQuery.trim().toLowerCase();
    if (!search) return enrollmentItems;

    return enrollmentItems.filter((item) => {
      return [
        item.courseTitle,
        item.userName,
        item.transactionId,
        String(item.id),
        String(item.userId),
        String(item.courseId),
      ]
        .filter(Boolean)
        .some((value) => value!.toLowerCase().includes(search));
    });
  }, [enrollmentItems, searchQuery]);

  const pendingCount = enrollmentItems.filter(
    (item) => item.paymentStatus === PaymentStatus.Pending,
  ).length;
  const approvedCount = enrollmentItems.filter(
    (item) =>
      item.paymentStatus === PaymentStatus.Completed &&
      item.status === EnrollmentStatus.Active,
  ).length;
  const rejectedCount = enrollmentItems.filter(
    (item) =>
      item.paymentStatus === PaymentStatus.Failed ||
      item.status === EnrollmentStatus.Cancelled,
  ).length;

  const reviewEnrollment = useMutation({
    mutationFn: async ({
      enrollment,
      action,
    }: {
      enrollment: Enrollment;
      action: "approve" | "reject";
    }) => {
      const payload: EnrollmentUpdateRequest = {
        paymentDate: enrollment.paymentDate || new Date().toISOString(),
        paymentStatus:
          action === "approve" ? PaymentStatus.Completed : PaymentStatus.Failed,
        status:
          action === "approve"
            ? EnrollmentStatus.Active
            : EnrollmentStatus.Cancelled,
      };

      console.log("Review enrollment payload:", {
        id: enrollment.id,
        action,
        ...payload,
      });

      const response = await enrollmentApi.update(enrollment.id, payload);
      console.log("Review enrollment response:", response.data);
      return response.data;
    },
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: ["enrollments"] });
      toast.success(
        response.message ||
          `Enrollment ${variables.action === "approve" ? "approved" : "rejected"} successfully`,
      );
    },
    onError: (error: unknown) => {
      const apiError = error as {
        response?: { data?: { message?: string } };
      };

      console.error(
        "Review enrollment failed:",
        apiError.response?.data || error,
      );
      toast.error(
        apiError.response?.data?.message ||
          "Failed to update enrollment. Please try again.",
      );
    },
    onSettled: () => {
      setActiveEnrollmentId(null);
    },
  });

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-zinc-500">
            {isAdmin ? "Admin Panel" : "Student Area"}
          </p>
          <h1 className="text-4xl font-black uppercase tracking-tighter md:text-5xl">
            {isAdmin ? "Manage Enrollments" : "My Enrollments"}
          </h1>
          <p className="max-w-2xl text-zinc-500">
            {isAdmin
              ? "Review all enrollment requests and approve or reject them in one place."
              : "Track the status of your course enrollments and payments."}
          </p>
        </div>

        <Button
          variant="outline"
          asChild
          className="rounded-xl font-bold uppercase tracking-widest"
        >
          <Link to="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Link>
        </Button>
      </div>

      {isAdmin && (
        <Card className="mb-6 rounded-xl border-2 shadow-none bg-zinc-50">
          <CardContent className="p-5 text-sm text-zinc-600">
            Approve sets the payment to <strong>Completed</strong> and the
            enrollment to <strong>Active</strong>. Reject sets the payment to
            <strong> Failed</strong> and the enrollment to{" "}
            <strong>Cancelled</strong>.
          </CardContent>
        </Card>
      )}

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="rounded-xl border-2 shadow-none">
          <CardContent className="p-5">
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
              Total Enrollments
            </p>
            <p className="mt-2 text-3xl font-black tracking-tighter">
              {enrollmentItems.length}
            </p>
          </CardContent>
        </Card>
        <Card className="rounded-xl border-2 shadow-none">
          <CardContent className="p-5">
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
              Pending Review
            </p>
            <p className="mt-2 text-3xl font-black tracking-tighter">
              {pendingCount}
            </p>
          </CardContent>
        </Card>
        <Card className="rounded-xl border-2 shadow-none">
          <CardContent className="p-5">
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
              Approved
            </p>
            <p className="mt-2 text-3xl font-black tracking-tighter">
              {approvedCount}
            </p>
          </CardContent>
        </Card>
        <Card className="rounded-xl border-2 shadow-none">
          <CardContent className="p-5">
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
              Rejected
            </p>
            <p className="mt-2 text-3xl font-black tracking-tighter">
              {rejectedCount}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6 rounded-xl border-2 shadow-none">
        <CardContent className="p-5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                isAdmin
                  ? "Search by course, student, transaction, or enrollment ID"
                  : "Search by course, transaction, or enrollment ID"
              }
              className="h-11 rounded-xl pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
        </div>
      ) : filteredEnrollments.length === 0 ? (
        <Card className="rounded-xl border-2 shadow-none">
          <CardContent className="py-12 text-center text-zinc-500">
            No enrollments found.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredEnrollments.map((enrollment) => {
            const isProcessing =
              reviewEnrollment.isPending &&
              activeEnrollmentId === enrollment.id;
            const isApproved =
              enrollment.paymentStatus === PaymentStatus.Completed &&
              enrollment.status === EnrollmentStatus.Active;
            const isRejected =
              enrollment.paymentStatus === PaymentStatus.Failed ||
              enrollment.status === EnrollmentStatus.Cancelled;

            return (
              <Card
                key={enrollment.id}
                className="rounded-xl border-2 shadow-none"
              >
                <CardHeader className="gap-3 md:flex-row md:items-start md:justify-between">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <CardTitle className="text-lg font-black uppercase tracking-tight">
                        {enrollment.courseTitle ||
                          `Course #${enrollment.courseId}`}
                      </CardTitle>
                      <Badge
                        className={`rounded-xl uppercase tracking-widest ${getEnrollmentBadgeClass(enrollment.status)}`}
                      >
                        {enrollmentStatusLabels[enrollment.status] || "Unknown"}
                      </Badge>
                      <Badge
                        className={`rounded-xl uppercase tracking-widest ${getPaymentBadgeClass(enrollment.paymentStatus)}`}
                      >
                        {paymentStatusLabels[enrollment.paymentStatus] ||
                          "Unknown"}
                      </Badge>
                    </div>

                    <div className="space-y-1 text-sm text-zinc-500">
                      {isAdmin && (
                        <p>
                          Student:{" "}
                          <strong>
                            {enrollment.userName ||
                              `User #${enrollment.userId}`}
                          </strong>
                        </p>
                      )}
                      <p>
                        Enrolled on{" "}
                        <strong>{formatDate(enrollment.enrollmentDate)}</strong>
                      </p>
                      <p>
                        Payment date:{" "}
                        <strong>{formatDate(enrollment.paymentDate)}</strong>
                      </p>
                    </div>

                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
                      Enrollment #{enrollment.id}
                      {typeof enrollment.amount === "number"
                        ? ` • $${enrollment.amount}`
                        : ""}
                      {enrollment.transactionId
                        ? ` • ${enrollment.transactionId}`
                        : ""}
                    </p>
                  </div>

                  {isAdmin ? (
                    <div className="flex flex-wrap gap-2">
                      <Button
                        className="rounded-xl font-bold uppercase tracking-widest"
                        disabled={reviewEnrollment.isPending || isApproved}
                        onClick={() => {
                          setActiveEnrollmentId(enrollment.id);
                          reviewEnrollment.mutate({
                            enrollment,
                            action: "approve",
                          });
                        }}
                      >
                        {isProcessing ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                        )}
                        {isApproved ? "Approved" : "Approve"}
                      </Button>
                      <Button
                        variant="destructive"
                        className="rounded-xl font-bold uppercase tracking-widest"
                        disabled={reviewEnrollment.isPending || isRejected}
                        onClick={() => {
                          setActiveEnrollmentId(enrollment.id);
                          reviewEnrollment.mutate({
                            enrollment,
                            action: "reject",
                          });
                        }}
                      >
                        {isProcessing ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <XCircle className="mr-2 h-4 w-4" />
                        )}
                        {isRejected ? "Rejected" : "Reject"}
                      </Button>
                    </div>
                  ) : (
                    <div className="rounded-xl bg-zinc-50 px-3 py-2 text-xs font-bold uppercase tracking-widest text-zinc-600">
                      Waiting for admin review
                    </div>
                  )}
                </CardHeader>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
