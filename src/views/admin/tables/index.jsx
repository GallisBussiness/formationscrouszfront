import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { ParticipantService } from "../../../services/participant.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { yupResolver } from 'mantine-form-yup-resolver';
import * as yup from 'yup';
import { DataTable } from "mantine-datatable";
import WeeklyRevenue from "../default/components/WeeklyRevenue";
import { AiOutlinePlus } from "react-icons/ai";
import { ActionIcon, Box, Button, Drawer, LoadingOverlay, Popover, Select, TextInput } from "@mantine/core";
import InputField from "components/fields/InputField";
import { FaTrash } from "react-icons/fa";
import { BsFillPenFill } from "react-icons/bs";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";

const ParticipantSchema = yup.object().shape({
  prenom: yup.string().required('Invalide Prenom'),
  matricule_de_solde: yup.string(),
  civilite: yup.string().required('Invalide Civilite'),
  nom: yup.string().required('Invalide Nom'),
  contact: yup.string().required('Invalide Contact'),
  fonction: yup.string().required('Invalide Fonction'),
});

const PAGE_SIZE = 10;

const Tables = () => {

  const [opened, { open, close }] = useDisclosure(false);
  const [openedU, { open:openU, close:closeU }] = useDisclosure(false);
  const [query, setQuery] = useState('');
  const [debouncedQuery] = useDebouncedValue(query, 200);
  const [page, setPage] = useState(1);
  const [records, setRecords] = useState([]);
  const qc = useQueryClient();
  const participantService = new ParticipantService();
  const key = ['participants'];
  const {data:participants,isLoading} = useQuery({ queryKey: key, queryFn:() => participantService.getAll() })

  const form = useForm({
    initialValues: {
      prenom: '',
      matricule_de_solde: '',
      civilite:'',
      nom: '',
      contact: '',
      fonction: '',
    },
    validate: yupResolver(ParticipantSchema),
  });
  const formU = useForm({
    initialValues: {
    _id:'', 
    prenom: '',
    matricule_de_solde:'',
    civilite:'',
    nom: '',
    contact: '',
    fonction: '',
    },
    validate: yupResolver(ParticipantSchema),
  });

  const {mutate:createParticipant,isLoading:loadingCreate} = useMutation({
   mutationFn: (data) => participantService.create(data),
   onSuccess: () => {
    close();
    qc.invalidateQueries(key);
    form.reset();
   }
});

const {mutate:updateParticipant,isLoading:loadingUpdate} = useMutation({
 mutationFn:(data) => participantService.update(data.id, data.data),
 onSuccess: () => {
  closeU();
  qc.invalidateQueries(key);
 }
});

const {mutate:deleteParticipant,isLoading:loadingDelete} = useMutation({
    mutationFn: (id) => participantService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries(key);
    }
});


  const confirm = (id) => {
    deleteParticipant(id)
  };
  
  const cancel = () => {
    notifications.show({message: "L'action a été annulé !"});
  };

  const onCreate = (values) => {
    createParticipant(values);
  }

  const onUpdate = (values) => {
    const {_id,createdAt,updatedAt,__v,...rest} = values;
    updateParticipant({id: _id,data: rest });
}

const handleUpdate  = (data) => {
  formU.setValues(data);
  openU();
}

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
}, [participants,debouncedQuery,page]);

  return (
    <div>
     <LoadingOverlay
         visible={loadingDelete}
         zIndex={1000}
         overlayProps={{ radius: 'sm', blur: 2 }}
         loaderProps={{ color: '#422AFB', type: 'dots' }}
       />
     <div className="mt-5">
     
     <WeeklyRevenue add={<div>
       <Button bg="#22C55E" leftSection={<AiOutlinePlus className="h-6 w-6 text-white"/>} onClick={open} >Nouveau</Button>
     </div>}>
     <>
     <div className="flex justify-between items-center w-1/2">
     <div className="w-full">
            <InputField value={query} onChange={(e) => setQuery(e.currentTarget.value)}  placeholder="Rechercher ..." />
      </div>
    </div>
     <DataTable
   columns={[{ accessor: 'matricule_de_solde', textAlign: 'center' },{ accessor: 'civilite', textAlign: 'center' },{ accessor: 'prenom', textAlign: 'center' },{ accessor: 'nom',textAlign: 'center' },{ accessor: 'contact',textAlign: 'center' },{ accessor: 'fonction',textAlign: 'center' },
   
   {
     accessor: 'actions',
     title: <Box mr={6}>actions</Box>,
     textAlign: 'center',
     render: (rowData) => (
         <div className="flex items-center justify-center space-x-1">
       <ActionIcon onClick={() => handleUpdate(rowData)} bg='white'>
       <BsFillPenFill className="text-green-500"/>
       </ActionIcon>
       <Popover width={200} position="bottom" withArrow shadow="md">
   <Popover.Target>
   <ActionIcon bg='white'>
     <FaTrash className="text-red-500" />
   </ActionIcon>
   </Popover.Target>
   <Popover.Dropdown>
    <div className="flex flex-col">
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
     </>
     
     </WeeklyRevenue>
   </div>

   <Drawer opened={opened} onClose={close} title="CREATION D'UN AGENT">
   <LoadingOverlay
         visible={loadingCreate}
         zIndex={1000}
         overlayProps={{ radius: 'sm', blur: 2 }}
         loaderProps={{ color: '#422AFB', type: 'dots' }}
       />
     <form onSubmit={form.onSubmit(onCreate)}>
     <Select
        withAsterisk
        label="CIVILITE"
        {...form.getInputProps('civilite')}
        data={["M.","Mme","Mlle"]}
         />
        <TextInput
        withAsterisk
        label="PRENOM"
        {...form.getInputProps('prenom')}
         />

        <TextInput
        withAsterisk
        label="NOM"
        {...form.getInputProps('nom')}
         />

      <TextInput
        withAsterisk
        label="Matricule de Solde"
        {...form.getInputProps('matricule_de_solde')}
         />

        <TextInput
        withAsterisk
        label="CONTACT"
        {...form.getInputProps('contact')}
         />
         <TextInput
        withAsterisk
        label="FONCTION"
        {...form.getInputProps('fonction')}
         />
       
       <div className="my-5">
           <Button type="submit" bg="#422AFB">SAUVEGARDER</Button>
       </div>
       
     </form>
   </Drawer>
   
   <Drawer position="right" opened={openedU} onClose={closeU} title="MODIFICATION D'UN AGENT">
   <LoadingOverlay
         visible={loadingUpdate}
         zIndex={1000}
         overlayProps={{ radius: 'sm', blur: 2 }}
         loaderProps={{ color: '#422AFB', type: 'dots' }}
       />
     <form onSubmit={formU.onSubmit(onUpdate)}>
     <Select
        withAsterisk
        label="CIVILITE"
        {...formU.getInputProps('civilite')}
        data={["M.","Mme","Mlle"]}
         />
     <TextInput
        withAsterisk
        label="PRENOM"
        {...formU.getInputProps('prenom')}
         />

        <TextInput
        withAsterisk
        label="NOM"
        {...formU.getInputProps('nom')}
         />
        <TextInput
        withAsterisk
        label="Matricule de Solde"
        {...formU.getInputProps('matricule_de_solde')}
         />
        <TextInput
        withAsterisk
        label="CONTACT"
        {...formU.getInputProps('contact')}
         />
         <TextInput
        withAsterisk
        label="FONCTION"
        {...formU.getInputProps('fonction')}
         />
       <div className="my-5">
           <Button type="submit" bg="#422AFB">SAUVEGARDER</Button>
       </div>
       
     </form>
   </Drawer>
    </div>
  );
};

export default Tables;
