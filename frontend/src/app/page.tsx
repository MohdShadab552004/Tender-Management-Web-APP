import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <main className="max-w-[1280px] mx-auto min-h-[calc(100dvh_-_60px)] flex py-10 px-4 max-lg:flex-col max-lg:items-center max-lg:gap-10">
        <section className="w-1/2 flex flex-col gap-5 justify-center max-md:w-full">
          <h4 className="bold text-5xl max-md:text-3xl">Streamline Your Tender Process</h4>
          <p>Our tender management application help you stay organied,<br/>track deadline, and collaborate with your team to win more bids.</p>
          <Link href='/tender/create' className="bg-[#000000] w-[150px] h-[50px] text-[#ffffff] text-md flex justify-center items-center rounded-xl hover:text-[#000000] hover:bg-[#ffffff] hover:border hover:shadow transition-colors duration-200 ease-in-out max-md:w-full">
            Let Started
          </Link>
        </section>
        <section className="relative w-1/2 h-[500px] max-md:w-full">
          <Image
           src="/images/hero-images.png" 
           alt="hero image" 
            fill
           className="w-full h-full object-fit"/>
        </section>
      </main>
    </>
    
  );
}
