"use client";
import { logout } from "@/actions";
import { useUIStore } from "@/store";
import clsx from "clsx";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  IoCloseOutline,
  IoLogInOutline,
  IoLogOutOutline,
  IoPeopleOutline,
  IoPersonOutline,
  IoSearchOutline,
  IoShirtOutline,
  IoTicketOutline,
} from "react-icons/io5";

export const Sidebar = () => {
  const isSideMenuOpen = useUIStore((state) => state.isSideMenuOpen);
  const closeMenu = useUIStore((state) => state.closeSideMenu);

  const { data: session } = useSession();

  const isAuthenticated = !!session?.user;
  const isAdmin = session?.user.role === "admin";

  const refresh = () => {
    window.location.replace("/");

    logout();
  };

  return (
    <div>
      {/* background black */}
      {isSideMenuOpen && (
        <div className="fixed top-0 left-0 w-screen h-screen z-10 bg-black opacity-30" />
      )}

      {/* Blur */}

      {isSideMenuOpen && (
        <div
          onClick={closeMenu}
          className=" fade-in fixed top-0 left-0 w-screen h-screen z-10 backdrop-filter backdrop-blur-sm"
        />
      )}

      <nav
        className={clsx(
          " fixed p-5 right-0 top-0 sm:w-[500px] h-screen bg-white z-20 shadow-2xl transform transition-all duration-300 overflow-y-auto",
          {
            "translate-x-full": !isSideMenuOpen,
          }
        )}
      >
        <IoCloseOutline
          size={40}
          className=" absolute top-5 right-5 cursor-pointer"
          onClick={closeMenu}
        />
        <div className=" relative mt-14">
          <IoSearchOutline size={20} className=" absolute top-2 left-2" />
          <input
            type="text"
            placeholder="Buscar"
            className=" w-full bg-gray-50 rounded pl-10 py-1 pr-10 border-b-2 text-lg border-gray-200 focus:outline-none focus:border-blue-500"
          />
        </div>
        {/* Menu */}
        {isAuthenticated && (
          <>
            <Link
              href={"/profile"}
              onClick={() => closeMenu()}
              className=" flex items-center mt-5 p-2 hover:bg-gray-100 rounded transition-all"
            >
              <IoPersonOutline size={20} />
              <span className=" ml-3 text-lg">Perfil</span>
            </Link>
            <Link
              href={"/orders"}
              onClick={() => closeMenu()}
              className=" flex items-center mt-5 p-2 hover:bg-gray-100 rounded transition-all"
            >
              <IoTicketOutline size={20} />
              <span className=" ml-3 text-lg">Ordenes</span>
            </Link>
          </>
        )}

        {isAuthenticated && (
          <button
            onClick={refresh}
            className=" w-full flex items-center mt-5 p-2 hover:bg-gray-100 rounded transition-all"
          >
            <IoLogOutOutline size={20} />
            <span className=" ml-3 text-lg">Salir</span>
          </button>
        )}
        {!isAuthenticated && (
          <Link
            href={"/auth/login"}
            onClick={() => {
              closeMenu();
            }}
            className=" flex items-center mt-5 p-2 hover:bg-gray-100 rounded transition-all"
          >
            <IoLogInOutline size={20} />
            <span className=" ml-3 text-lg">Ingresar</span>
          </Link>
        )}

        {isAdmin && (
          <>
            {/* Line Separator */}
            <div className=" w-full h-px bg-gray-200 my-10" />
            <Link
              href={"/admin/products"}
              onClick={() => {
                closeMenu();
              }}
              className=" flex items-center mt-5 p-2 hover:bg-gray-100 rounded transition-all"
            >
              <IoShirtOutline size={20} />
              <span className=" ml-3 text-lg">Productos</span>
            </Link>
            <Link
              onClick={() => {
                closeMenu();
              }}
              href={"/admin/orders"}
              className=" flex items-center mt-5 p-2 hover:bg-gray-100 rounded transition-all"
            >
              <IoTicketOutline size={20} />
              <span className=" ml-3 text-lg">Ordenes</span>
            </Link>
            <Link
              onClick={() => {
                closeMenu();
              }}
              href={"/admin/users"}
              className=" flex items-center mt-5 p-2 hover:bg-gray-100 rounded transition-all"
            >
              <IoPeopleOutline size={20} />
              <span className=" ml-3 text-lg">Usuarios</span>
            </Link>
          </>
        )}
      </nav>
    </div>
  );
};
