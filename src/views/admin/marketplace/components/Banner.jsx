import { DatePicker } from "@mantine/dates";
import nft1 from "assets/img/nfts/NftBanner1.png";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { FaPrint } from "react-icons/fa";
import pdfMake from "pdfmake/build/pdfmake";
import { bg } from "./bg";
import { logo } from "./logo";
import { font } from "../../../../vfs_fonts";
pdfMake.vfs = font;

pdfMake.fonts = {
  Roboto: {
    normal: 'Roboto-Regular.ttf',
    bold: 'Roboto-Bold.ttf',
    italics: 'Roboto-BlackItalic.ttf',
    bolditalics: 'Roboto-BoldItalic.ttf'
  },
  GreatVibes: {
    normal: 'GreatVibes-Regular.ttf',
    italics: 'GreatVibes-Regular.ttf',
  },
  AnastasiaScript: {
    normal: 'AnastasiaScript.ttf',
  },
  AlexBrush:{
    normal: 'AlexBrush.ttf',
  },
  Maulysia: {
    normal: 'Maulysia-qZjL1.ttf',
  }
}

const Banner1 = ({nom,consultant,debut,fin,participants,nom_cabinet}) => {
  const generateAttestation = () => {
 
    const docDefinition = {
      pageSize: 'A4',

     pageOrientation: 'landscape',
      pageMargins: [ 0, 0, 0, 0 ],
      background: {
        image: bg,
        width: 850,
        height:600
      },
      styles: {
        
      },
      content:[
        participants.map(p => ([
          {
            layout:'noBorders',
            table: {
              widths: ['100%'],
              body: [
                [ {image:logo,width: 100, height: 100,margin:[40,40,0,0]}],
              ]
            }
          },
          
          {
            alignment:'center',
            layout:'noBorders',
            table: {
              widths: ['100%'],
              body: [
                [ {text:`DE PARTICIPATION`,fontSize: 20,bold: true,color:'black',margin:[0,60,0,0]}],
              ]
            }
          },
          {
            alignment:'center',
            layout:'noBorders',
            table: {
              widths: ['100%'],
              body: [
                [ {text:`Ce certificat est délivré avec fierté à `,fontSize: 18,bold: true,color:'black',margin:[0,5]}],
              ]
            }
          },
          {
            alignment:'center',
            layout:'noBorders',
            table: {
              widths: ['100%'],
              body: [
                [ {text:`${p.civilite} ${p.prenom} ${p.nom}`,fontSize: 35,font: 'Maulysia',color:'black',margin:[0,4]}],
              ]
            }
          },
          {
            alignment:'center',
            layout:'noBorders',
            table: {
              widths: ['100%'],
              body: [
                [ {text:`Pour avoir participé à la formation intitulée`,fontSize: 16,bold: true,color:'black',margin:[0,10,0,5]}],
              ]
            }
          },
          {
            alignment:'center',
            layout:'noBorders',
            table: {
              widths: ['100%'],
              body: [
                [ {text:`${nom}`,fontSize: 20,color:'black',bold:true,margin:[0,5,0,35]}],
              ]
            }
          },
          {
            pageBreak:'after',
            margin:[190,0],
            columnGap: 5,
            columns: [
              {
              with: '20%',
              alignment:'center',
              stack: [
                {text:"LE DIRECTEUR",fontSize: 14,bold: true,alignment:"center"},
              ]},
              
              {
                with:'20%',
                alignment:'center',
                stack:[
                  {text:"CONSULTANT(E)",fontSize: 14,bold: true,alignment:"center"},
                ]
                
              }
            ]
          },
        ]))
      ]
    }
    
      pdfMake.createPdf(docDefinition).open();
    }

  return (
    <div
      className="flex w-full flex-col rounded-[20px] bg-cover px-[30px] py-[30px] md:px-[34px] md:py-[56px]"
      style={{ backgroundImage: `url(${nft1})` }}
    >
      <div className="flex items-center justify-between w-full">
        <div className="w-3/4">
        <h4 className="mb-[14px] max-w-full text-xl font-bold text-white md:w-[64%] md:text-3xl md:leading-[42px] lg:w-[46%] xl:w-[85%] 2xl:w-[75%] 3xl:w-[52%]">
         {nom}
        </h4>
        <p className="max-w-full text-base font-medium text-[#E3DAFF] md:w-[64%] lg:w-[40%] xl:w-[72%] 2xl:w-[60%] 3xl:w-[45%]">
         PAR: {consultant}
        </p>
        <p className="max-w-full text-base font-medium text-[#E3DAFF] md:w-[64%] lg:w-[40%] xl:w-[72%] 2xl:w-[60%] 3xl:w-[45%]">
         CABINET: {nom_cabinet}
        </p>


        <div className="mt-[36px] flex items-center justify-between gap-4 sm:justify-start 2xl:gap-10">
          <button onClick={generateAttestation} className="text-black linear rounded-xl bg-white px-4 py-2 text-center text-base font-medium transition duration-200 hover:!bg-white/80 active:!bg-white/70">
            CERTIFICATS DE PARTICIPATION <FaPrint className="inline w-6 h-6"/>
          </button>
        </div>
      </div>
      <div className=" bg-white w-1/4 p-2 rounded-md">
        <div className="center">
          <h4 className="max-w-full text-md font-semibold text-[#422AFB]">
            DU {format(debut,'dd/MM/yyyy',{locale:fr})} AU {format(fin,'dd/MM/yyyy',{locale:fr})}
          </h4>
        </div>
        <DatePicker type="range" locale="fr" allowDeselect={false} defaultDate={parseISO(debut)} value={[parseISO(debut),parseISO(fin)]}  minDate={parseISO(debut)} maxDate={parseISO(fin)}/>
      </div>
      </div>
      
    </div>
  );
};

export default Banner1;
