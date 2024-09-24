import Card from "components/card";

const WeeklyRevenue = ({add,children}) => {
  return (
    <Card extra="flex flex-col bg-white w-full rounded-3xl py-6 px-2 text-center">
      <div className="mb-auto flex items-center justify-between px-6">
        {add}
      </div>

      <div className="md:mt-16 lg:mt-0">
        <div className="h-[250px] w-full xl:h-[450px]">
         {children}
        </div>
      </div>
    </Card>
  );
};

export default WeeklyRevenue;
