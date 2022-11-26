import SideBar from '../../components/sidebar';
import withUser from '../../wrapper/check-user';
import Image from 'next/image';
import usePlugin from '../../hooks/plugins';
import { PlusIcon } from '@heroicons/react/solid';
import { useRouter } from 'next/router';
import Link from 'next/link';
const Cards = () => {
  const router = useRouter();

  const { plugins } = usePlugin();
  return (
    <div className="relative bg-gray-50 px-4 pt-16 pb-20 sm:px-6 lg:px-8 lg:pt-24 lg:pb-28">
      <div className="absolute inset-0">
        <div className="h-1/3 bg-white sm:h-2/3" />
      </div>
      <div className="relative mx-auto max-w-7xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Integrations
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-xl text-gray-500 sm:mt-4">
            {/* Start integrating the tools */}
          </p>
        </div>
        <div className="mx-auto mt-12 grid max-w-lg gap-5 lg:max-w-none lg:grid-cols-3">
          {plugins.map(plugin => (
            <div
              key={plugin.title}
              className="flex flex-col overflow-hidden rounded-lg shadow-lg">
              <div className="flex-shrink-0">
                <Image
                  className="h-48 w-full object-cover"
                  src={plugin.imageSrc}
                  alt="Apps"
                  width={120}
                  height={50}
                  objectFit="contain"
                />
              </div>
              <div className="flex flex-1 flex-col justify-between bg-white p-6">
                <div className="flex-1">
                  <p className="text-sm font-medium text-indigo-600">
                    {/* <a href={plugin.category.href} target='_blank' className="" rel="noreferrer">
                      {plugin.category.name}
                    </a> */}
                  </p>
                  <div className="mt-2 block">
                    <p className="text-xl font-semibold text-gray-900">
                      {plugin.title}
                    </p>
                    <p className="mt-3 text-base text-gray-500">
                      {plugin.description}
                    </p>
                  </div>
                </div>
                <div className="mt-6 flex items-center">
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      {plugin.routeLink ? (
                        <div
                        className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                          <Link href={plugin.routeLink}>
                            <a>
                              <PlusIcon
                                className="-ml-0.5 mr-2 h-4 w-4"
                                aria-hidden="true"
                              />
                              Integrate Now
                            </a>
                          </Link>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            router.push(plugin.href);
                          }}
                          className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                          <PlusIcon
                            className="-ml-0.5 mr-2 h-4 w-4"
                            aria-hidden="true"
                          />
                          Integrate Now
                        </button>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Integrations = () => {
  return (
    <>
      <SideBar>
        <div className="ml-5 flex flex-col flex-1  h-screen overflow-y-auto no-scrollbar mt-5 text-gray-800 dark:text-white">
          <div className="flex flex-row gap-3 mt-10">
            <Cards />
          </div>
        </div>
      </SideBar>
    </>
  );
};

export default withUser(Integrations);
