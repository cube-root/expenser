const extractSheet = (sharableLink: string) => {
  const splitArray = sharableLink.split('/');
  const index = splitArray.indexOf('d');
  if (index === -1) {
    throw new Error('Invalid sheet link');
  }
  return splitArray[index + 1];
};

export { extractSheet };
