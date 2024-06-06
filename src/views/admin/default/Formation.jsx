import { LoadingOverlay } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom"
import { FormationService } from "../../../services/formation.service";
import ColumnsTable from "../tables/components/ColumnsTable";
import Banner1 from "../marketplace/components/Banner";

function Formation() {
    const {id} = useParams();
    const key = ['formation',id];
    const formationService = new FormationService() 
    const {data:formation,isLoading} = useQuery({
        queryKey:key,
        queryFn: () => formationService.getOne(id)
    })
  return (
    <div>
        <LoadingOverlay
         visible={isLoading}
         zIndex={1000}
         overlayProps={{ radius: 'sm', blur: 2 }}
         loaderProps={{ color: 'blue', type: 'bars' }}
       />
    {formation && 
    <div className="flex flex-col space-y-2">
    <Banner1 nom={formation.nom} consultant={formation.consultant} debut={formation.debut} fin={formation.fin} participants={formation.participants} />
    <ColumnsTable columnsData={[{Header:'PRENOM',accessor:'prenom'},{Header:'NOM',accessor:'nom'},{Header:'CONTACT',accessor:'contact'},{Header:'FONCTION',accessor:'fonction'},]} tableData={formation?.participants} nom="PARTICIPANTS" nbr={formation?.participants.length} />
    </div>}
    </div>
  )
}

export default Formation