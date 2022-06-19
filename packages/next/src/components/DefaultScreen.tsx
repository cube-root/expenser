import Image from 'next/image';
import Link from 'next/link';
import useMode from '../hooks/mode';
const Home = ({
    children
}: {
    children: any
}) => {
    const { darkMode } = useMode();
    return (<div className="bg-white h-screen w-full dark:bg-slate-900 relative">
        <div className="flex flex-col items-center px-4 justify-center h-full space-y-4 text-slate-900 dark:text-slate-100">
            <div className="flex items-center justify-between w-full max-w-4xl sm:justify-center">
                <Image
                    src={darkMode ? '/logo/straight-white.svg' : '/logo/straight.svg'}
                    alt="logo"
                    width={150}
                    height={50}
                />
                <Link href={'https://github.com/cube-root/expenser'} passHref={true}>
                    <a className="bg-slate-100 p-2 rounded-full inline-flex sm:absolute sm:top-4 sm:right-4">
                        <Image
                            src="/images/github.svg"
                            alt="logo"
                            width={20}
                            height={20}
                        />
                    </a>
                </Link>
            </div>
            <div className="w-full relative h-1/2 sm:h-1/3 top-8">
                <Image
                    src={
                        darkMode
                            ? '/images/intro-image-dark.png'
                            : '/images/intro-image.png'
                    }
                    alt="logo"
                    layout="fill"
                    objectFit="contain"
                />
            </div>
            <div className="flex items-center flex-col space-y-8 relative z-10">
                {children}
            </div>
        </div>
    </div>)
}

export default Home;