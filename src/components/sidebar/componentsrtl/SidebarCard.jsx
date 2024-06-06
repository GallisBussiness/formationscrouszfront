import { Link } from "react-router-dom";

const FreeCard = () => {
  return (
    <div className="relative mt-14 flex w-[256px] justify-center rounded-[20px] bg-gradient-to-br from-[#868CFF] via-[#432CF3] to-brand-500 pb-4">
      <div className="absolute -top-12 flex h-24 w-24 items-center justify-center rounded-full border-[4px] border-white bg-gradient-to-b from-[#868CFF] to-brand-500 dark:!border-navy-800">
      <Link className="inline-block" to="/">
              <div className="flex items-center justify-center w-20 h-20 rounded-full bg-white">
               <img src='/logo-bg.png' alt="Logo" className='w-16 h-16 p-2' />
             </div>
              </Link>
      </div>

      <div className="mt-16 flex h-fit flex-col items-center">
        <p className="text-lg font-bold text-white">CROUS/Z</p>
        <p className="mt-1 px-4 text-center text-sm text-white">
          CENTRE REGIONALE DES OEUVRES UNIVERSITAIRES SOCIALES DE ZIGUINCHOR
        </p>
      </div>
    </div>
  );
};

export default FreeCard;
