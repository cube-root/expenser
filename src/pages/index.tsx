import { useRouter } from 'next/router';

const Home = () => {
  const router = useRouter();
  return (
    <div className="bg-black h-screen w-screen">
      <div className="flex flex-row top-0  justify-between mx-10 pt-10  ">
        <p className="text-white font-mono">Expenser</p>
        <a
          href="https://github.com/cube-root/expenser"
          target="_blank"
          rel="noreferrer"
        >
          <img src="https://img.icons8.com/color-glass/48/000000/github.png" />
        </a>
      </div>
      <div className="font-mono text-white place-items-center grid grid-cols-1 gap-1 content-center pt-56">
        <div className="p-2">
          <p className="text-xl p-2">
            Your data belongs to You <span className="animate-ping"> !</span>
          </p>
        </div>
        <div className="p-2">
          <p className="text-sm p-2">
            Manage you personal bills using Google Sheets
          </p>
        </div>
        <div className="border border-white p-2 mt-10  hover:bg-white hover:text-black">
          <button
            className="p-2"
            onClick={() => {
              router.push('/login');
            }}
          >
            Getting started
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
