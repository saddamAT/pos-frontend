import PrintOrder from '@/components/order/PrintOrder'

type PageProps = {
  params: {
    id: string
  }
  searchParams?: { [key: string]: string | string[] | undefined }
}

export default function Page({ params }: PageProps) {
  return (
    <>
      <PrintOrder id={params.id} />
    </>
  )
}
