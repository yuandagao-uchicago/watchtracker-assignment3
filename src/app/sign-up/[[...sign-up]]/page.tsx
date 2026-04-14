import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="relative -mx-4 sm:-mx-6 lg:-mx-8 -mt-8 min-h-[calc(100vh-3.5rem)] flex items-center justify-center">
      {/* Poster grid background */}
      <div className="absolute inset-0 grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-1 opacity-[0.06] p-2">
        {[
          "d5NXSklXo0qyIYkgV94XAgMIckC", "8cdWjvZQUExUUTzyp4t6EDMubfO",
          "vpnVM9B6NMmQpWeZvzLvDESb2QY", "qJ2tW6WMUDux911kpUpMebfRdEo",
          "sv1xJUazXeYqALzczSZ3O6nkH75", "1pdfLvkbY9ohJlCjQH2CZjjYVvJ",
          "8Gxv8gSFCU0XGDykEGv7zR1n2ua", "ztkUQFLlC19CCMYHW9o1zWhJRNq",
          "ljsZTbVsrQSqZgWeep2B1QiDKuh", "9cqNxx0GxF0bflZmeSMuL5tnGzr",
          "fqldf2t8ztc9aiwn3k6mlX3tvRT", "eKfVzzEazSIjJMrw9ADa2x8ksLz",
          "pPHpeI2X1qEd1CS1SeyrdhZ4qnT", "d5NXSklXo0qyIYkgV94XAgMIckC",
          "8cdWjvZQUExUUTzyp4t6EDMubfO", "vpnVM9B6NMmQpWeZvzLvDESb2QY",
        ].map((id, i) => (
          <div key={i} className="aspect-[2/3] overflow-hidden">
            <img src={`https://image.tmdb.org/t/p/w200/${id}.jpg`} alt="" className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/90 to-black" />

      {/* Form */}
      <div className="relative z-10">
        <SignUp />
      </div>
    </div>
  );
}
