"use client"
import Image from "next/image";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import Banner from "@/assets/images/property-banner.png"
import { fetchAPI } from "../utils/api-handler";
import { useEffect, useState } from "react";

export default function PropertiesLayout({ children }) {
    const [properties, setproperties] = useState(null)
    const pathname = usePathname();
    const getNavList = async (lang = "en") => {
        const path = `/properties`;
        const urlParamsObject = {
            populate: "deep",
            locale: lang,
            pagination: {
                start: 0,
                limit: 10,
            },
        };
        const options = {};

        const response = await fetchAPI(path, urlParamsObject, options);
        setproperties(response?.data[0]?.attributes)
        if (response?.data) {
            return response?.data;
        } else {
            return null;
        }

    }
    console.log(properties);
    useEffect(() => {
        if (pathname.includes('/ar/')) {
            getNavList('ar')
        } else if (pathname.includes('/en/')) {
            getNavList('en')
        }
    }, [])
    return (
        <div>
            <div>
                <div className="position-relative">
                    <Image src={Banner} alt="" className="w-100 object-fit-cover position-absolute z-0" />
                    <div style={{ fontSize: '28px', marginTop: '40px' }} className=" navbar-padding position-absolute  z-3 text-white">{properties?.mainTitle}</div>
                </div>
            </div>
            <div className="bg-backgroundClr  text-white" style={{ paddingTop: '110px' }} >
                <nav className="d-flex  gap-4 pt-2 navbar-padding" >
                    <li className={` d-flex justify-content-center align-items-center ${pathname.includes("/properties/commercial") ? "active-tab" : ""}`} style={{ listStyleType: "none", padding: "10px 15px" }}>
                        <Link href={"/properties/commercial"} style={{ textDecoration: 'none', color: pathname.includes("/properties/commercial") ? "black" : "white" }}>{properties?.titleOne}</Link>
                    </li>
                    <li className={`${pathname.includes("/properties/residential") ? "active-tab" : ""}`} style={{ listStyleType: "none", padding: "10px 15px" }}>
                        <Link href={"/properties/residential"} style={{ textDecoration: 'none', color: pathname.includes("/properties/residential") ? "black" : "white" }}>{properties?.titleTwo}</Link>
                    </li>
                </nav>
            </div>
            {children}

        </div>
    );
}
