import { useEffect, useState } from 'react';

const Storage = (): any => {
  const [userData, setUserData] = useState<any>({});
  useEffect(() => {
   console.log(userData);

  }, [userData]);

  return [setUserData];
};

export default Storage;
