import WeeklyRevenue from "views/admin/default/components/WeeklyRevenue";
import Widget from "components/widget/Widget";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FormationService } from "services/formation.service";
import { ParticipantService } from "services/participant.service";
import { ActionIcon, Box, Button, Drawer, LoadingOverlay, MultiSelect, Popover, Select, TextInput } from "@mantine/core";
import { DataTable } from "mantine-datatable";
import InputField from "components/fields/InputField";
import { AiOutlinePlus } from "react-icons/ai";
import { useEffect, useState } from "react";
import { yupResolver } from 'mantine-form-yup-resolver';
import * as yup from 'yup';
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useForm } from "@mantine/form";
import { DateInput } from "@mantine/dates";
import "dayjs/locale/fr"
import { BsFillPenFill } from "react-icons/bs";
import { FaBook, FaFolder, FaPrint, FaTrash, FaUser, FaUsers } from "react-icons/fa";
import { ConsultantService } from "services/consultant.service";
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useNavigate } from "react-router-dom";
import { logo } from "../marketplace/components/logo";
import { drapeau } from "./drapeau";
import pdfMake from "pdfmake/build/pdfmake";
import { font } from "../../../vfs_fonts";
pdfMake.vfs = font;

const PAGE_SIZE = 10;

const FormationSchema = yup.object().shape({
  nom: yup.string().required('Invalide Nom'),
  debut: yup.date().required('invalide debut'),
  fin: yup.date().required('invalide debut'),
  consultant: yup.string().required('Invalide Formation'),
  participants: yup.array(yup.string()).required('Invalide participants'),
});


const Dashboard = () => {

  const [opened, { open, close }] = useDisclosure(false);
  const [openedU, { open:openU, close:closeU }] = useDisclosure(false);
  const [page, setPage] = useState(1);
  const [records, setRecords] = useState([]);
  const [query, setQuery] = useState('');
  const [debouncedQuery] = useDebouncedValue(query, 200);
  const navigate = useNavigate();
  const qc = useQueryClient();
  const formationService = new FormationService();
  const consultantService = new ConsultantService();
  const participantService = new ParticipantService();
  const key = ['formations'];
  const {data:formations,isLoading: isLoadingF} = useQuery({ queryKey: key, queryFn:() => formationService.getAll() })
  const {data:consultants,isLoading:isLoadingC} = useQuery({ queryKey: ['consultants'], queryFn:() => consultantService.getAll() })
  const {data:participants,isLoading:isLoadingP} = useQuery({ queryKey: ['participants'], queryFn:()=> participantService.getAll() })

  const form = useForm({
    initialValues: {
        nom: '',
        debut: new Date(),
        fin: new Date(),
        consultant: '',
        participants: [],
    },
    validate: yupResolver(FormationSchema),
  });
  const formU = useForm({
    initialValues: {
    _id:'', 
    nom: '',
    debut: new Date(),
    fin: new Date(),
    consultant: '',
    participants: [],
    },
    validate: yupResolver(FormationSchema),
  });

  const {mutate:createFormation,isLoading:loadingCreate} = useMutation({
   mutationFn: (data) => formationService.create(data),
   onSuccess: () => {
    close();
    qc.invalidateQueries(key);
    form.reset();
   }
});

const {mutate:updateFormation,isLoading:loadingUpdate} = useMutation({
 mutationFn:(data) => formationService.update(data.id, data.data),
 onSuccess: () => {
  closeU();
  qc.invalidateQueries(key);
 }
});

const {mutate:deleteFormation,isLoading:loadingDelete} = useMutation({
    mutationFn: (id) => formationService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries(key);
    }
});


  const confirm = (id) => {
    deleteFormation(id)
  };
  
  const cancel = () => {
    notifications.show("L'action a été annulé !");
  };

  const onCreate = (values) => {
    createFormation(values);
  }

  const onUpdate = (values) => {
    const {_id,createdAt,updatedAt,__v,...rest} = values;
    updateFormation({id: _id,data: rest });
}

const handleUpdate  = (data) => {
  const {consultant,participants,debut,fin} = data;
  const partips = participants.map(p => p._id);
  formU.setValues({...data,consultant:consultant._id,participants:partips,debut: parseISO(debut),fin:parseISO(fin)});
  openU();
}

  const filtered = (formations = []) => {
    return  formations?.filter(({ nom }) => {
      if (
        debouncedQuery !== '' &&
        !`${nom}`.toLowerCase().includes(debouncedQuery.trim().toLowerCase())
      )
        return false;

      return true;
    })
  }

  useEffect(() => {
      const from = (page - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE;
      setRecords(filtered(formations).slice(from, to) ?? []);
    }, [page,formations,debouncedQuery]);

    const print = (v) => {
     
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
            [ {text:`RAPPORT SUR LES FORMATIONS EFFECTUEES`,fontSize: 16,bold: true,color:'white',margin:[0,4]}],
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
          widths: ['35%','20%','20%','25%'],
            body: [
                [{text:'NOM',style:'entete'}, {text:'DEBUT',style:'entete'},{text:'FIN',style:'entete'},{text:'CONSULTANT',style:'entete'}],
                 ...formations?.map((k)=> (
                  [{text:`${k.nom}`,style:'info'},
                  {text: `${format(k.debut,'dd/MM/yyyy',{locale:fr})}`,style:'info'},
                 {text: `${format(k.fin,'dd/MM/yyyy',{locale:fr})}`,style:'info'},
                 {text: `${k.consultant.prenom} ${k.consultant.nom}`,style:'info'}
                ]
                )),
            ],
        }
    },
    ]
    }
    
      pdfMake.createPdf(docDefinition).open();
  }

  return (
    <div>
      {/* Card widget */}
      <LoadingOverlay
         visible={loadingDelete || isLoadingC || isLoadingP || isLoadingF}
         zIndex={1000}
         overlayProps={{ radius: 'sm', blur: 2 }}
         loaderProps={{ color: 'blue', type: 'dots' }}
       />
      <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3 3xl:grid-cols-6">
        <Widget
          icon={<FaBook className="h-7 w-7" />}
          title={"TOTAL FORMATIONS"}
          subtitle={formations?.length}
        />
        <Widget
          icon={<FaUser className="h-6 w-6" />}
          title={"TOTAL CONSULTANTS"}
          subtitle={consultants?.length}
        />
        <Widget
          icon={<FaUsers className="h-7 w-7" />}
          title={"TOTAL PARTICIPANTS"}
          subtitle={participants?.length}
        />
      </div>

      {/* Charts */}

      <div className="mt-5">
     
        <WeeklyRevenue add={<div className="flex space-x-2">
          <Button bg="#22C55E" leftSection={<AiOutlinePlus className="h-6 w-6 text-white"/>} onClick={open} >Nouvelle</Button>
          <Button bg="#422AFB" leftSection={<FaPrint className="h-6 w-6 text-white"/>} onClick={print}>IMPRIMER RAPPORT</Button>
        </div>}>
        <>
        <div className="flex justify-between items-center w-1/2">
        <div className="w-full">
               <InputField value={query} onChange={(e) => setQuery(e.currentTarget.value)}  placeholder="Rechercher ..." />
         </div>
       </div>
        <DataTable
      columns={[{ accessor: 'nom',textAlign: 'center', }, 
      {
        accessor: 'debut',
        textAlign: 'center',
        render: ({ debut }) => format(debut, "dd/MM/yyyy",{locale:fr}),
      },
      {
        accessor: 'fin',
        textAlign: 'center',
        render: ({ fin }) => format(fin,"dd/MM/yyyy",{locale:fr}),
      },
      
      {
        accessor: 'actions',
        title: <Box mr={6}>actions</Box>,
        textAlign: 'right',
        render: (rowData) => (
            <div className="flex items-center justify-center space-x-1">
          <ActionIcon bg='white' onClick={() => navigate(rowData._id)}>
          <FaFolder className="text-blue-500"/>
          </ActionIcon>
          <ActionIcon bg='white' onClick={() => handleUpdate(rowData)}>
          <BsFillPenFill className="text-green-500"/>
          </ActionIcon>
          <Popover width={200} position="bottom" withArrow shadow="md">
      <Popover.Target>
      <ActionIcon bg='white'>
        <FaTrash className="text-red-500" />
      </ActionIcon>
      </Popover.Target>
      <Popover.Dropdown>
       <div className="flex flexcol">
        <div className="flex-1">Etes-vous sûr de vouloir supprimer?</div>
        <div className="flex-1 flex justify-between">
          <Button variant="outline" color="red" onClick={() => confirm(rowData?._id)}>Oui</Button>
          <Button variant="outline" color="green" onClick={cancel}>Non</Button>
        </div>
       </div>
      </Popover.Dropdown>
    </Popover>
         </div>
        ),
      },
    ]}
      records={records}
      idAccessor="_id"
      fetching={isLoadingF}
      totalRecords={filtered(formations)?.length}
      recordsPerPage={PAGE_SIZE}
      page={page}
      onPageChange={(p) => setPage(p)}
      borderRadius="lg"
      shadow="lg"
      horizontalSpacing="xs"
      verticalAlign="top"
    />
        </>
        
        </WeeklyRevenue>
      </div>

      {/* Tables & Charts */}

      <Drawer opened={opened} onClose={close} title="CREATION D'UNE FORMATION">
   <LoadingOverlay
         visible={loadingCreate}
         zIndex={1000}
         overlayProps={{ radius: 'sm', blur: 2 }}
         loaderProps={{ color: 'blue', type: 'bars' }}
       />
     <form onSubmit={form.onSubmit(onCreate)}>
     <Select
        withAsterisk
        label="CONSULTANT"
        {...form.getInputProps('consultant')}
        data={consultants?.map((c) => ({label:`${c.prenom} ${c.nom} ${c.nom_cabinet}`,value:c._id}))}
       />
        <TextInput
        withAsterisk
        label="NOM DE LA FORMATION"
        {...form.getInputProps('nom')}
         />
         <DateInput
         locale="fr"
        withAsterisk
        label="DEBUT DE LA FORMATION"
        {...form.getInputProps('debut')}
         />
          <DateInput
        withAsterisk
        locale="fr"
        label="FIN DE LA FORMATION"
        {...form.getInputProps('fin')}
         />
         <MultiSelect
        withAsterisk
        label="PARTICIPANTS"
        {...form.getInputProps('participants')}
        data={participants?.map((c) => ({label:`${c.prenom} ${c.nom} ${c.fonction}`,value:c._id}))}
       />
       <div className="my-5">
           <Button type="submit" bg="#422AFB">SAUVEGARDER</Button>
       </div>
       
     </form>
   </Drawer>
   
   <Drawer position="right" opened={openedU} onClose={closeU} title="MODIFICATION D'UNE FORMATION">
   <LoadingOverlay
         visible={loadingUpdate}
         zIndex={1000}
         overlayProps={{ radius: 'sm', blur: 2 }}
         loaderProps={{ color: 'blue', type: 'bars' }}
       />
     <form onSubmit={formU.onSubmit(onUpdate)}>
       <Select
        withAsterisk
        label="CONSULTANT"
        {...formU.getInputProps('consultant')}
        data={consultants?.map((c) => ({label:`${c.prenom} ${c.nom} ${c.nom_cabinet}`,value:c._id}))}
       />
        <TextInput
        withAsterisk
        label="NOM DE LA FORMATION"
        {...formU.getInputProps('nom')}
         />
         <DateInput
         locale="fr"
        withAsterisk
        label="DEBUT DE LA FORMATION"
        {...formU.getInputProps('debut')}
         />
          <DateInput
        withAsterisk
        locale="fr"
        label="FIN DE LA FORMATION"
        {...formU.getInputProps('fin')}
         />
         <MultiSelect
        withAsterisk
        label="PARTICIPANTS"
        {...formU.getInputProps('participants')}
        data={participants?.map((c) => ({label:`${c.prenom} ${c.nom} ${c.fonction}`,value:c._id}))}
       />
       <div className="my-5">
           <Button type="submit" bg="#422AFB">SAUVEGARDER</Button>
       </div>
       
     </form>
   </Drawer>
    </div>
  );
};

export default Dashboard;
