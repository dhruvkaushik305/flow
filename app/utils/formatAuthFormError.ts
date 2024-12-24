export function formatAuthFormError(errorMessage: any) {
  const errorDetails = JSON.parse(errorMessage);

  const issues = {};

  errorDetails.forEach((errorDetail) => {
    issues[errorDetail.path[0]] = errorDetail.message;
  });

  return issues;
}
