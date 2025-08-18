const SeasonHeader = () => {
  return (
    <div className="p-4 md:p-6 flex flex-col md:flex-row justify-center items-center bg-black w-full">
      <img className="w-16 md:w-24 lg:w-32" src="banner-f1.png" alt="" />
      <h1 className="text-xl md:text-5xl text-7xl text-red-600 font-medium">
        F1 Standings Explorer
      </h1>
    </div>
  );
};

export default SeasonHeader;
