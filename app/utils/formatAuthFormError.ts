export function formatAuthFormError(errorMessage: string) {
  const errorDetails = JSON.parse(errorMessage);

  const issues: Record<string, string> = {};

  errorDetails.forEach((errorDetail: any) => {
    issues[errorDetail.path[0]] = errorDetail.message;
  });

  return issues;
}
