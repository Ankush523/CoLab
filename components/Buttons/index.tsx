import Image from "next/image";
import link from "@/images/link.png";
export default function Button() {
  const openNewTab = () => {
    window.open("https://colab-huddle.vercel.app/gpa-vzfj-kpz", "_blank");
  };

  return(
    <div className="flex flex-row justify-between bg-purple-200 border border-purple-800 space-x-2  px-4 rounded-full text-purple-800 shadow-xl">
        <button className="my-1" onClick={openNewTab}>Join Meeting</button>
        <Image src={link} alt="external-link" className="w-5 h-5 mt-1"/>
    </div>
);
}
