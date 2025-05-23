import PrintOrder from '@/components/PrintOrder'
import SharjahPrintOrder from '@/components/SharjahPrintOrder'

type PageProps = {
  params: {
    id: string
  }
  searchParams?: { [key: string]: string | string[] | undefined }
}

export default function Page({ params }: PageProps) {
  return (
    <>
      {/* <PrintOrder id={params.id} /> */}
      <SharjahPrintOrder id={params.id} />
    </>
  )
}
