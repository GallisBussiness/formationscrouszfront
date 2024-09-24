import { Button, Drawer,LoadingOverlay } from "@mantine/core";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom"
import { FormationService } from "../../../services/formation.service";
import Banner1 from "../marketplace/components/Banner";
import { AiOutlinePlus } from "react-icons/ai";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { DataTable } from "mantine-datatable";
import { ParticipantService } from "services/participant.service";
import InputField from "components/fields/InputField";
import { FaPrint } from "react-icons/fa";
import { logo } from "../marketplace/components/logo";
import { drapeau } from "./drapeau";
import pdfMake from "pdfmake/build/pdfmake";
import { font } from "../../../vfs_fonts";
pdfMake.vfs = font;

const PAGE_SIZE = 10;

function Formation() {
  const [query, setQuery] = useState('');
  const [debouncedQuery] = useDebouncedValue(query, 200);
  const [page, setPage] = useState(1);
  const [pagel, setPagel] = useState(1);
  const [records, setRecords] = useState([]);
//   const [files, setFiles] = useState([]);
// const [isModalOpen, setIsModalOpen] = useState(false);
    const {id} = useParams();
    const key = ['formation',id];
    const [opened, { open, close }] = useDisclosure(false);
    const participantService = new ParticipantService();
    const qc = useQueryClient();
  const keyf = ['participants'];
  const {data:participants,isLoading:isLoadingP} = useQuery({ queryKey: keyf, queryFn:() => participantService.getAll() })
    const formationService = new FormationService() 
    const {data:formation,isLoading} = useQuery({
        queryKey:key,
        queryFn: () => formationService.getOne(id),
    })

    const [selectedAgents, setSelectedAgents] = useState([]);

    const {mutate:updateFormation,isLoading:loadingUpdate} = useMutation({
      mutationFn:(data) => formationService.update(id, data),
      onSuccess: () => {
       close();
       qc.invalidateQueries(key);
      }
     });

    const confirm = () => {
      const p = selectedAgents.map(a => a._id);
      updateFormation({participants:p});
    };

      // const {mutate:uploadDocs,isLoading:loadingUpldoc} = useMutation({
      //   mutationFn:(data) => docService.create(data),
      //   onSuccess:(_) => {
      //     message.success("Enregistrement du fichier effectué");
      //     qc.invalidateQueries(keydocs);
      //     setFiles([]);
      //   }
      // })

    // const previews = files.map((file, index) => {
    //   return <Tag color="blue"  key={index}>{file.path} </Tag>;
    // });
    const filtered = (Participant = []) => {
      return Participant?.filter(({ prenom,nom,fonction,matricule_de_solde }) => {
        if (
          debouncedQuery !== '' &&
          !`${prenom}${nom}${fonction}${matricule_de_solde}`.toLowerCase().includes(debouncedQuery.trim().toLowerCase())
        )
          return false;
      
        return true;
      })
    }
    
    useEffect(() => {
      const from = (page - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE;
      setRecords(filtered(participants).slice(from, to) ?? []);
      setSelectedAgents(formation?.participants)
    }, [participants,debouncedQuery,page,formation]);


    const print = () => {
     
      const docDefinition = {
       footer: {text:`CENTRE REGIONAL DES OEUVRES UNIVERSITAIRES SOCIALES DE ZIGUINCHOR`,fontSize: 8,bold: true,alignment: 'center'},
       styles: {
         entete: {
             bold: true,
             alignment:'center',
             fontSize:10
         },
         center: {
             alignment:'center',
         },
         left: {
           alignment:'left',
       },
       right: {
         alignment:'right',
     },
         nombre: {
           alignment:'right',
           fontSize:10,
           bold: true
       },
       tword: {
         fontSize:10,
         italics:true
     },
     tword1: {
       fontSize:12,
       margin:[0,10,0,10]
   },
          info: {
           fontSize:8,
       },
         header3: {
             color:"white",
             fillColor: '#73BFBA',
             bold: true,
             alignment:'center',
             fontSize:6,
         },
         header4: {
           color:"white",
           fillColor: '#73BFBA',
           bold: true,
           alignment:'right',
           fontSize:6
       },
         total:{
             color:"white",
             bold: true,
             fontSize:6,
             fillColor:'#73BFBA',
             alignment:'center'
         },
         anotherStyle: {
           italics: true,
           alignment: 'right'
         }
       },
       content:[
         {
         columnGap: 100,
         columns: [
           {
           with: 'auto',
           alignment:'left',
           stack: [
             {text:"REPUBLIQUE DU SENEGAL\n",fontSize: 10,bold: true,alignment:"center"},
             {text:"Un Peuple, Un but, Une Foi\n",fontSize: 10,bold: true,margin:[0,2],alignment:"center"},
             {image:drapeau,width: 40,alignment:"center"},
             {text:"MINISTERE DE L'ENSEIGNEMENT SUPERIEUR DE LA RECHERCHE ET DE L'INNOVATION \n",fontSize: 10,bold: true,margin:[0,2],alignment:"center"},
             {text:"CENTRE REGIONAL DES OEUVRES UNIVERSITAIRES SOCIALES DE ZIGUINCHOR\n",fontSize: 10,bold: true,margin:[0,2],alignment:"center"},
             {text:"DIVISION DES RESSOURCES HUMAINES",fontSize: 10,bold: true,alignment:"center"},
             {text:"SERVICE DE LA FORMATION",fontSize: 10,bold: true,alignment:"center"}
           ]},
           
           {
             with:'auto',
             alignment:'right',
             stack:[
               {image:logo,width: 80,alignment:"right"},
             ]
             
           },
         
         ],
         
       },
       {
         margin: [0,10],
         fillColor:"#422AFB",
         alignment:'center',
         layout:'noBorders',
         table: {
           widths: ['100%'],
           body: [
             [ {text:`LISTE DES PARTICIPANTS`,fontSize: 16,bold: true,color:'white',margin:[0,4]}],
           ]
         }
       },

       {
        margin: [0,2],
        fillColor:"#A3AED0",
        alignment:'center',
        layout:'noBorders',
        table: {
          widths: ['100%'],
          body: [
            [ {text:`Intitulée: ${formation?.nom}`,fontSize: 12,bold: true,color:'white',margin:[0,2]}],
          ]
        }
      },
 
       {
         margin: [4,4,4,4],
         alignment: 'justify',
         layout: {
           fillColor: function (rowIndex, node, columnIndex) {
             return (rowIndex === 0) ? '#A3AED0' : null;
           }
         },
         table: {
           widths: ['20%','20%','40%','20%'],
             body: [
                 [{text:'NOM',style:'entete'}, {text:'PRENOM',style:'entete'},{text:'FONCTION',style:'entete'},{text:'CONTACT',style:'entete'}],
                  ...formation?.participants.sort((a,b) => a.nom.localeCompare(b.nom)).map((k)=> (
                   [{text:`${k.nom}`,style:'info'},
                   {text: `${k.prenom}`,style:'info'},
                  {text: `${k.fonction}`,style:'info'},
                  {text: `${k.contact}`,style:'info'}
                 ]
                 )),
             ],
         }
     },
     ]
     }
     
       pdfMake.createPdf(docDefinition).open();
   }

  //  const ViewDoc = (path) => {
  //   const fullPath = import.meta.env.VITE_BACKURL + "/uploads/formation-docs/"+ path ;
  //   window.open(fullPath,'_blank')?.focus();
  // }

  return (
    <div>
        <LoadingOverlay
         visible={isLoading || isLoadingP || loadingUpdate}
         zIndex={1000}
         overlayProps={{ radius: 'sm', blur: 2 }}
         loaderProps={{ color: 'blue', type: 'bars' }}
       />
    {formation && 
    <div className="flex flex-col space-y-2">
    <Banner1 nom={formation.nom} consultant={formation.consultants.map(c => c.prenom + ' ' + c.nom).join(',')} nom_cabinet={formation.consultants.length > 0 ? formation.consultants[0].nom_cabinet : ''} debut={formation.debut} fin={formation.fin} participants={formation.participants} />
    <div className="my-5">
         <div className="my-5 flex items-center justify-between">
         <Button bg="#4312EC" leftSection={<FaPrint className="h-6 w-6 text-white"/>} onClick={print} >Imprimer la liste des Participants</Button>
         <Button bg="#22C55E" leftSection={<AiOutlinePlus className="h-6 w-6 text-white"/>} onClick={open} >Ajouter Participant(e)</Button>
         </div>
         
         <DataTable
      striped
      highlightOnHover
      withTableBorder
      withColumnBorders
      records={formation?.participants}
      columns={[{ accessor: 'matricule_de_solde', textAlign: 'center' },{ accessor: 'civilite', textAlign: 'center' },{ accessor: 'prenom', textAlign: 'center' },{ accessor: 'nom',textAlign: 'center' },{ accessor: 'contact',textAlign: 'center' },{ accessor: 'fonction',textAlign: 'center' }]}
      idAccessor="_id"
      totalRecords={formation?.participants?.length}
      recordsPerPage={20}
      page={pagel}
      onPageChange={(p) => setPagel(p)}
      borderRadius="lg"
      shadow="lg"
      horizontalSpacing="xs"
      verticalAlign="top"
    />
    </div>
    </div>}

    <Drawer opened={opened} size="xl" onClose={close} title="Ajouter les participant(e)s">
    <div className="w-full my-5">
            <InputField value={query} onChange={(e) => setQuery(e.currentTarget.value)}  placeholder="Rechercher ..." />
      </div>
    <DataTable
      striped
      highlightOnHover
      withTableBorder
      withColumnBorders
      records={records}
      columns={[
        { accessor: 'matricule_de_solde', textAlign: 'center' },
        { accessor: 'civilite', textAlign: 'center' },
        { accessor: 'prenom', textAlign: 'center' },
        { accessor: 'nom',textAlign: 'center' },
        { accessor: 'contact',textAlign: 'center' },
        { accessor: 'fonction',textAlign: 'center' }]}
      selectedRecords={selectedAgents}
      onSelectedRecordsChange={setSelectedAgents}
      idAccessor="_id"
      fetching={isLoading}
      totalRecords={filtered(participants)?.length}
      recordsPerPage={10}
      page={page}
      onPageChange={(p) => setPage(p)}
      borderRadius="lg"
      shadow="lg"
      horizontalSpacing="xs"
      verticalAlign="top"
    />

       <div className="my-5">
           <Button type="submit" bg="#422AFB" onClick={confirm}>SAUVEGARDER</Button>
       </div>
   </Drawer>
    </div>
  )
}

export default Formation