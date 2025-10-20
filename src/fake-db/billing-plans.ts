import type { InvoiceType } from '@/types/apps/invoiceTypes'
import { PricingPlanType } from '@/types/pages/pricingTypes'
import type { Data } from '@/types/pages/profileTypes'

const now = new Date()
const currentMonth = now.toLocaleString('default', { month: 'short' })

export const billingPlansDb: InvoiceType[] = [
  {
    id: '4987',
    issuedDate: `13 ${currentMonth} ${now.getFullYear()}`,
    address: '7777 Mendez Plains',
    company: 'Hall-Robbins PLC',
    companyEmail: 'don85@johnson.com',
    country: 'USA',
    contact: '(616) 865-4180',
    name: 'Jordan Stevenson',
    service: 'Software Development',
    total: 3428,
    avatar: '',
    avatarColor: 'primary',
    invoiceStatus: 'Paid',
    balance: '$724',
    dueDate: `23 ${currentMonth} ${now.getFullYear()}`
  },
  {
    id: '4988',
    issuedDate: `17 ${currentMonth} ${now.getFullYear()}`,
    address: '04033 Wesley Wall Apt. 961',
    company: 'Mccann LLC and Sons',
    companyEmail: 'brenda49@taylor.info',
    country: 'Haiti',
    contact: '(226) 204-8287',
    name: 'Stephanie Burns',
    service: 'UI/UX Design & Development',
    total: 5219,
    avatar: '/images/avatars/1.png',
    invoiceStatus: 'Downloaded',
    balance: 0,
    dueDate: `15 ${currentMonth} ${now.getFullYear()}`
  },
  {
    id: '4989',
    issuedDate: `19 ${currentMonth} ${now.getFullYear()}`,
    address: '5345 Robert Squares',
    company: 'Leonard-Garcia and Sons',
    companyEmail: 'smithtiffany@powers.com',
    country: 'Denmark',
    contact: '(955) 676-1076',
    name: 'Tony Herrera',
    service: 'Unlimited Extended License',
    total: 3719,
    avatar: '/images/avatars/2.png',
    invoiceStatus: 'Paid',
    balance: 0,
    dueDate: `03 ${currentMonth} ${now.getFullYear()}`
  },
  {
    id: '4990',
    issuedDate: `06 ${currentMonth} ${now.getFullYear()}`,
    address: '19022 Clark Parks Suite 149',
    company: 'Smith, Miller and Henry LLC',
    companyEmail: 'mejiageorge@lee-perez.com',
    country: 'Cambodia',
    contact: '(832) 323-6914',
    name: 'Kevin Patton',
    service: 'Software Development',
    total: 4749,
    avatar: '/images/avatars/3.png',
    invoiceStatus: 'Sent',
    balance: 0,
    dueDate: `11 ${currentMonth} ${now.getFullYear()}`
  },
  {
    id: '4991',
    issuedDate: `08 ${currentMonth} ${now.getFullYear()}`,
    address: '8534 Saunders Hill Apt. 583',
    company: 'Garcia-Cameron and Sons',
    companyEmail: 'brandon07@pierce.com',
    country: 'Martinique',
    contact: '(970) 982-3353',
    name: 'Mrs. Julie Donovan MD',
    service: 'UI/UX Design & Development',
    total: 4056,
    avatar: '/images/avatars/4.png',
    invoiceStatus: 'Draft',
    balance: '$815',
    dueDate: `30 ${currentMonth} ${now.getFullYear()}`
  },
  {
    id: '4992',
    issuedDate: `26 ${currentMonth} ${now.getFullYear()}`,
    address: '661 Perez Run Apt. 778',
    company: 'Burnett-Young PLC',
    companyEmail: 'guerrerobrandy@beasley-harper.com',
    country: 'Botswana',
    contact: '(511) 938-9617',
    name: 'Amanda Phillips',
    service: 'UI/UX Design & Development',
    total: 2771,
    avatar: '',
    avatarColor: 'secondary',
    invoiceStatus: 'Paid',
    balance: 0,
    dueDate: `24 ${currentMonth} ${now.getFullYear()}`
  },
  {
    id: '4993',
    issuedDate: `17 ${currentMonth} ${now.getFullYear()}`,
    address: '074 Long Union',
    company: 'Wilson-Lee LLC',
    companyEmail: 'williamshenry@moon-smith.com',
    country: 'Montserrat',
    contact: '(504) 859-2893',
    name: 'Christina Collier',
    service: 'UI/UX Design & Development',
    total: 2713,
    avatar: '',
    avatarColor: 'success',
    invoiceStatus: 'Draft',
    balance: '$407',
    dueDate: `22 ${currentMonth} ${now.getFullYear()}`
  },
  {
    id: '4994',
    issuedDate: `11 ${currentMonth} ${now.getFullYear()}`,
    address: '5225 Ford Cape Apt. 840',
    company: 'Schwartz, Henry and Rhodes Group',
    companyEmail: 'margaretharvey@russell-murray.com',
    country: 'Oman',
    contact: '(758) 403-7718',
    name: 'David Flores',
    service: 'Template Customization',
    total: 4309,
    avatar: '/images/avatars/5.png',
    invoiceStatus: 'Paid',
    balance: '-$205',
    dueDate: `10 ${currentMonth} ${now.getFullYear()}`
  },
  {
    id: '4995',
    issuedDate: `26 ${currentMonth} ${now.getFullYear()}`,
    address: '23717 James Club Suite 277',
    company: 'Henderson-Holder PLC',
    companyEmail: 'dianarodriguez@villegas.com',
    country: 'Cambodia',
    contact: '(292) 873-8254',
    name: 'Valerie Perez',
    service: 'Software Development',
    total: 3367,
    avatar: '/images/avatars/6.png',
    invoiceStatus: 'Downloaded',
    balance: 0,
    dueDate: `24 ${currentMonth} ${now.getFullYear()}`
  },
  {
    id: '4996',
    issuedDate: `15 ${currentMonth} ${now.getFullYear()}`,
    address: '4528 Myers Gateway',
    company: 'Page-Wise PLC',
    companyEmail: 'bwilson@norris-brock.com',
    country: 'Guam',
    contact: '(956) 803-2008',
    name: 'Susan Dickerson',
    service: 'Software Development',
    total: 4776,
    avatar: '/images/avatars/7.png',
    invoiceStatus: 'Downloaded',
    balance: '$305',
    dueDate: `02 ${currentMonth} ${now.getFullYear()}`
  },
  {
    id: '4997',
    issuedDate: `27 ${currentMonth} ${now.getFullYear()}`,
    address: '4234 Mills Club Suite 107',
    company: 'Turner PLC Inc',
    companyEmail: 'markcampbell@bell.info',
    country: 'United States Virgin Islands',
    contact: '(716) 962-8635',
    name: 'Kelly Smith',
    service: 'Unlimited Extended License',
    total: 3789,
    avatar: '/images/avatars/8.png',
    invoiceStatus: 'Partial Payment',
    balance: '$666',
    dueDate: `18 ${currentMonth} ${now.getFullYear()}`
  },
  {
    id: '4998',
    issuedDate: `31 ${currentMonth} ${now.getFullYear()}`,
    address: '476 Keith Meadow',
    company: 'Levine-Dorsey PLC',
    companyEmail: 'mary61@rosario.com',
    country: 'Syrian Arab Republic',
    contact: '(523) 449-0782',
    name: 'Jamie Jones',
    service: 'Unlimited Extended License',
    total: 5200,
    avatar: '/images/avatars/1.png',
    invoiceStatus: 'Partial Payment',
    balance: 0,
    dueDate: `17 ${currentMonth} ${now.getFullYear()}`
  },
  {
    id: '4999',
    issuedDate: `14 ${currentMonth} ${now.getFullYear()}`,
    address: '56381 Ashley Village Apt. 332',
    company: 'Hall, Thompson and Ramirez LLC',
    companyEmail: 'sean22@cook.com',
    country: 'Ukraine',
    contact: '(583) 470-8356',
    name: 'Ruben Garcia',
    service: 'Software Development',
    total: 4558,
    avatar: '/images/avatars/2.png',
    invoiceStatus: 'Paid',
    balance: 0,
    dueDate: `01 ${currentMonth} ${now.getFullYear()}`
  },
  {
    id: '5000',
    issuedDate: `21 ${currentMonth} ${now.getFullYear()}`,
    address: '6946 Gregory Plaza Apt. 310',
    company: 'Lambert-Thomas Group',
    companyEmail: 'mccoymatthew@lopez-jenkins.net',
    country: 'Vanuatu',
    contact: '(366) 906-6467',
    name: 'Ryan Meyer',
    service: 'Template Customization',
    total: 3503,
    avatar: '/images/avatars/3.png',
    invoiceStatus: 'Paid',
    balance: 0,
    dueDate: `22 ${currentMonth} ${now.getFullYear()}`
  },
  {
    id: '5001',
    issuedDate: `30 ${currentMonth} ${now.getFullYear()}`,
    address: '64351 Andrew Lights',
    company: 'Gregory-Haynes PLC',
    companyEmail: 'novakshannon@mccarty-murillo.com',
    country: 'Romania',
    contact: '(320) 616-3915',
    name: 'Valerie Valdez',
    service: 'Unlimited Extended License',
    total: 5285,
    avatar: '/images/avatars/4.png',
    invoiceStatus: 'Partial Payment',
    balance: '-$202',
    dueDate: `02 ${currentMonth} ${now.getFullYear()}`
  },
  {
    id: '5002',
    issuedDate: `21 ${currentMonth} ${now.getFullYear()}`,
    address: '5702 Sarah Heights',
    company: 'Wright-Schmidt LLC',
    companyEmail: 'smithrachel@davis-rose.net',
    country: 'Costa Rica',
    contact: '(435) 899-1963',
    name: 'Melissa Wheeler',
    service: 'UI/UX Design & Development',
    total: 3668,
    avatar: '/images/avatars/5.png',
    invoiceStatus: 'Downloaded',
    balance: '$731',
    dueDate: `15 ${currentMonth} ${now.getFullYear()}`
  },
  {
    id: '5003',
    issuedDate: `30 ${currentMonth} ${now.getFullYear()}`,
    address: '668 Robert Flats',
    company: 'Russell-Abbott Ltd',
    companyEmail: 'scott96@mejia.net',
    country: 'Congo',
    contact: '(254) 399-4728',
    name: 'Alan Jimenez',
    service: 'Unlimited Extended License',
    total: 4372,
    avatar: '',
    avatarColor: 'warning',
    invoiceStatus: 'Sent',
    balance: '-$344',
    dueDate: `17 ${currentMonth} ${now.getFullYear()}`
  },
  {
    id: '5004',
    issuedDate: `27 ${currentMonth} ${now.getFullYear()}`,
    address: '55642 Chang Extensions Suite 373',
    company: 'Williams LLC Inc',
    companyEmail: 'cramirez@ross-bass.biz',
    country: 'Saint Pierre and Miquelon',
    contact: '(648) 500-4338',
    name: 'Jennifer Morris',
    service: 'Template Customization',
    total: 3198,
    avatar: '/images/avatars/6.png',
    invoiceStatus: 'Partial Payment',
    balance: '-$253',
    dueDate: `16 ${currentMonth} ${now.getFullYear()}`
  },
  {
    id: '5005',
    issuedDate: `30 ${currentMonth} ${now.getFullYear()}`,
    address: '56694 Eric Orchard',
    company: 'Hudson, Bell and Phillips PLC',
    companyEmail: 'arielberg@wolfe-smith.com',
    country: 'Uruguay',
    contact: '(896) 544-3796',
    name: 'Timothy Stevenson',
    service: 'Unlimited Extended License',
    total: 5293,
    avatar: '',
    avatarColor: 'error',
    invoiceStatus: 'Past Due',
    balance: 0,
    dueDate: `01 ${currentMonth} ${now.getFullYear()}`
  },
  {
    id: '5006',
    issuedDate: `10 ${currentMonth} ${now.getFullYear()}`,
    address: '3727 Emma Island Suite 879',
    company: 'Berry, Gonzalez and Heath Inc',
    companyEmail: 'yrobinson@nichols.com',
    country: 'Israel',
    contact: '(236) 784-5142',
    name: 'Erik Hayden',
    service: 'Template Customization',
    total: 5612,
    avatar: '/images/avatars/7.png',
    invoiceStatus: 'Downloaded',
    balance: '$883',
    dueDate: `12 ${currentMonth} ${now.getFullYear()}`
  },
  {
    id: '5007',
    issuedDate: `01 ${currentMonth} ${now.getFullYear()}`,
    address: '953 Miller Common Suite 580',
    company: 'Martinez, Fuller and Chavez and Sons',
    companyEmail: 'tatejennifer@allen.net',
    country: 'Cook Islands',
    contact: '(436) 717-2419',
    name: 'Katherine Kennedy',
    service: 'Software Development',
    total: 2230,
    avatar: '/images/avatars/8.png',
    invoiceStatus: 'Sent',
    balance: 0,
    dueDate: `19 ${currentMonth} ${now.getFullYear()}`
  },
  {
    id: '5008',
    issuedDate: `22 ${currentMonth} ${now.getFullYear()}`,
    address: '808 Sullivan Street Apt. 135',
    company: 'Wilson and Sons LLC',
    companyEmail: 'gdurham@lee.com',
    country: 'Nepal',
    contact: '(489) 946-3041',
    name: 'Monica Fuller',
    service: 'Unlimited Extended License',
    total: 2032,
    avatar: '/images/avatars/1.png',
    invoiceStatus: 'Partial Payment',
    balance: 0,
    dueDate: `30 ${currentMonth} ${now.getFullYear()}`
  },
  {
    id: '5009',
    issuedDate: `30 ${currentMonth} ${now.getFullYear()}`,
    address: '25135 Christopher Creek',
    company: 'Hawkins, Johnston and Mcguire PLC',
    companyEmail: 'jenny96@lawrence-thompson.com',
    country: 'Kiribati',
    contact: '(274) 246-3725',
    name: 'Stacey Carter',
    service: 'UI/UX Design & Development',
    total: 3128,
    avatar: '/images/avatars/2.png',
    invoiceStatus: 'Paid',
    balance: 0,
    dueDate: `10 ${currentMonth} ${now.getFullYear()}`
  },
  {
    id: '5010',
    issuedDate: `06 ${currentMonth} ${now.getFullYear()}`,
    address: '81285 Rebecca Estates Suite 046',
    company: 'Huynh-Mills and Sons',
    companyEmail: 'jgutierrez@jackson.com',
    country: 'Swaziland',
    contact: '(258) 211-5970',
    name: 'Chad Davis',
    service: 'Software Development',
    total: 2060,
    avatar: '/images/avatars/3.png',
    invoiceStatus: 'Downloaded',
    balance: 0,
    dueDate: `08 ${currentMonth} ${now.getFullYear()}`
  },
  {
    id: '5011',
    issuedDate: `01 ${currentMonth} ${now.getFullYear()}`,
    address: '3102 Briggs Dale Suite 118',
    company: 'Jones-Cooley and Sons',
    companyEmail: 'hunter14@jones.com',
    country: 'Congo',
    contact: '(593) 965-4100',
    name: 'Chris Reyes',
    service: 'UI/UX Design & Development',
    total: 4077,
    avatar: '',
    avatarColor: 'info',
    invoiceStatus: 'Draft',
    balance: 0,
    dueDate: `01 ${currentMonth} ${now.getFullYear()}`
  },
  {
    id: '5012',
    issuedDate: `30 ${currentMonth} ${now.getFullYear()}`,
    address: '811 Jill Skyway',
    company: 'Jones PLC Ltd',
    companyEmail: 'pricetodd@johnson-jenkins.com',
    country: 'Brazil',
    contact: '(585) 829-2603',
    name: 'Laurie Summers',
    service: 'Template Customization',
    total: 2872,
    avatar: '/images/avatars/4.png',
    invoiceStatus: 'Partial Payment',
    balance: 0,
    dueDate: `18 ${currentMonth} ${now.getFullYear()}`
  },
  {
    id: '5013',
    issuedDate: `05 ${currentMonth} ${now.getFullYear()}`,
    address: '2223 Brandon Inlet Suite 597',
    company: 'Jordan, Gomez and Ross Group',
    companyEmail: 'perrydavid@chapman-rogers.com',
    country: 'Congo',
    contact: '(527) 351-5517',
    name: 'Lindsay Wilson',
    service: 'Software Development',
    total: 3740,
    avatar: '/images/avatars/5.png',
    invoiceStatus: 'Draft',
    balance: 0,
    dueDate: `01 ${currentMonth} ${now.getFullYear()}`
  },
  {
    id: '5014',
    issuedDate: `01 ${currentMonth} ${now.getFullYear()}`,
    address: '08724 Barry Causeway',
    company: 'Gonzalez, Moody and Glover LLC',
    companyEmail: 'leahgriffin@carpenter.com',
    country: 'Equatorial Guinea',
    contact: '(628) 903-0132',
    name: 'Jenna Castro',
    service: 'Unlimited Extended License',
    total: 3623,
    avatar: '',
    avatarColor: 'primary',
    invoiceStatus: 'Downloaded',
    balance: 0,
    dueDate: `23 ${currentMonth} ${now.getFullYear()}`
  },
  {
    id: '5015',
    issuedDate: `16 ${currentMonth} ${now.getFullYear()}`,
    address: '073 Holt Ramp Apt. 755',
    company: 'Ashley-Pacheco Ltd',
    companyEmail: 'esparzadaniel@allen.com',
    country: 'Seychelles',
    contact: '(847) 396-9904',
    name: 'Wendy Weber',
    service: 'Software Development',
    total: 2477,
    avatar: '/images/avatars/6.png',
    invoiceStatus: 'Draft',
    balance: 0,
    dueDate: `01 ${currentMonth} ${now.getFullYear()}`
  },
  {
    id: '5016',
    issuedDate: `24 ${currentMonth} ${now.getFullYear()}`,
    address: '984 Sherry Trail Apt. 953',
    company: 'Berry PLC Group',
    companyEmail: 'todd34@owens-morgan.com',
    country: 'Ireland',
    contact: '(852) 249-4539',
    name: 'April Yates',
    service: 'Unlimited Extended License',
    total: 3904,
    avatar: '',
    avatarColor: 'secondary',
    invoiceStatus: 'Paid',
    balance: '$951',
    dueDate: `30 ${currentMonth} ${now.getFullYear()}`
  },
  {
    id: '5017',
    issuedDate: `24 ${currentMonth} ${now.getFullYear()}`,
    address: '093 Jonathan Camp Suite 953',
    company: 'Allen Group Ltd',
    companyEmail: 'roydavid@bailey.com',
    country: 'Netherlands',
    contact: '(917) 984-2232',
    name: 'Daniel Marshall PhD',
    service: 'UI/UX Design & Development',
    total: 3102,
    avatar: '/images/avatars/7.png',
    invoiceStatus: 'Partial Payment',
    balance: '-$153',
    dueDate: `25 ${currentMonth} ${now.getFullYear()}`
  },
  {
    id: '5018',
    issuedDate: `29 ${currentMonth} ${now.getFullYear()}`,
    address: '4735 Kristie Islands Apt. 259',
    company: 'Chapman-Schneider LLC',
    companyEmail: 'baldwinjoel@washington.com',
    country: 'Cocos (Keeling) Islands',
    contact: '(670) 409-3703',
    name: 'Randy Rich',
    service: 'UI/UX Design & Development',
    total: 2483,
    avatar: '/images/avatars/8.png',
    invoiceStatus: 'Draft',
    balance: 0,
    dueDate: `10 ${currentMonth} ${now.getFullYear()}`
  },
  {
    id: '5019',
    issuedDate: `07 ${currentMonth} ${now.getFullYear()}`,
    address: '92218 Andrew Radial',
    company: 'Mcclure, Hernandez and Simon Ltd',
    companyEmail: 'psmith@morris.info',
    country: 'Macao',
    contact: '(646) 263-0257',
    name: 'Mrs. Jodi Chapman',
    service: 'Unlimited Extended License',
    total: 2825,
    avatar: '/images/avatars/1.png',
    invoiceStatus: 'Partial Payment',
    balance: '-$459',
    dueDate: `14 ${currentMonth} ${now.getFullYear()}`
  },
  {
    id: '5020',
    issuedDate: `10 ${currentMonth} ${now.getFullYear()}`,
    address: '2342 Michelle Valley',
    company: 'Hamilton PLC and Sons',
    companyEmail: 'lori06@morse.com',
    country: 'Somalia',
    contact: '(751) 213-4288',
    name: 'Steven Myers',
    service: 'Unlimited Extended License',
    total: 2029,
    avatar: '/images/avatars/2.png',
    invoiceStatus: 'Past Due',
    balance: 0,
    dueDate: `28 ${currentMonth} ${now.getFullYear()}`
  },
  {
    id: '5021',
    issuedDate: `02 ${currentMonth} ${now.getFullYear()}`,
    address: '16039 Brittany Terrace Apt. 128',
    company: 'Silva-Reeves LLC',
    companyEmail: 'zpearson@miller.com',
    country: 'Slovakia (Slovak Republic)',
    contact: '(655) 649-7872',
    name: 'Charles Alexander',
    service: 'Software Development',
    total: 3208,
    avatar: '',
    avatarColor: 'success',
    invoiceStatus: 'Sent',
    balance: 0,
    dueDate: `06 ${currentMonth} ${now.getFullYear()}`
  },
  {
    id: '5022',
    issuedDate: `02 ${currentMonth} ${now.getFullYear()}`,
    address: '37856 Olsen Lakes Apt. 852',
    company: 'Solis LLC Ltd',
    companyEmail: 'strongpenny@young.net',
    country: 'Brazil',
    contact: '(402) 935-0735',
    name: 'Elizabeth Jones',
    service: 'Software Development',
    total: 3077,
    avatar: '',
    avatarColor: 'error',
    invoiceStatus: 'Sent',
    balance: 0,
    dueDate: `09 ${currentMonth} ${now.getFullYear()}`
  },
  {
    id: '5023',
    issuedDate: `23 ${currentMonth} ${now.getFullYear()}`,
    address: '11489 Griffin Plaza Apt. 927',
    company: 'Munoz-Peters and Sons',
    companyEmail: 'carrietorres@acosta.com',
    country: 'Argentina',
    contact: '(915) 448-6271',
    name: 'Heidi Walton',
    service: 'Software Development',
    total: 5578,
    avatar: '/images/avatars/3.png',
    invoiceStatus: 'Draft',
    balance: 0,
    dueDate: `23 ${currentMonth} ${now.getFullYear()}`
  },
  {
    id: '5024',
    issuedDate: `28 ${currentMonth} ${now.getFullYear()}`,
    address: '276 Michael Gardens Apt. 004',
    company: 'Shea, Velez and Garcia LLC',
    companyEmail: 'zjohnson@nichols-powers.com',
    country: 'Philippines',
    contact: '(817) 700-2984',
    name: 'Christopher Allen',
    service: 'Software Development',
    total: 2787,
    avatar: '/images/avatars/4.png',
    invoiceStatus: 'Partial Payment',
    balance: 0,
    dueDate: `25 ${currentMonth} ${now.getFullYear()}`
  },
  {
    id: '5025',
    issuedDate: `21 ${currentMonth} ${now.getFullYear()}`,
    address: '633 Bell Well Apt. 057',
    company: 'Adams, Simmons and Brown Group',
    companyEmail: 'kayla09@thomas.com',
    country: 'Martinique',
    contact: '(266) 611-9482',
    name: 'Joseph Oliver',
    service: 'UI/UX Design & Development',
    total: 5591,
    avatar: '',
    avatarColor: 'warning',
    invoiceStatus: 'Downloaded',
    balance: 0,
    dueDate: `07 ${currentMonth} ${now.getFullYear()}`
  },
  {
    id: '5026',
    issuedDate: `24 ${currentMonth} ${now.getFullYear()}`,
    address: '1068 Lopez Fall',
    company: 'Williams-Lawrence and Sons',
    companyEmail: 'melvindavis@allen.info',
    country: 'Mexico',
    contact: '(739) 745-9728',
    name: 'Megan Roberts',
    service: 'Template Customization',
    total: 2783,
    avatar: '/images/avatars/5.png',
    invoiceStatus: 'Draft',
    balance: 0,
    dueDate: `22 ${currentMonth} ${now.getFullYear()}`
  },
  {
    id: '5027',
    issuedDate: `13 ${currentMonth} ${now.getFullYear()}`,
    address: '86691 Mackenzie Light Suite 568',
    company: 'Deleon Inc LLC',
    companyEmail: 'gjordan@fernandez-coleman.com',
    country: 'Costa Rica',
    contact: '(682) 804-6506',
    name: 'Mary Garcia',
    service: 'Template Customization',
    total: 2719,
    avatar: '',
    avatarColor: 'info',
    invoiceStatus: 'Sent',
    balance: 0,
    dueDate: `04 ${currentMonth} ${now.getFullYear()}`
  },
  {
    id: '5028',
    issuedDate: `18 ${currentMonth} ${now.getFullYear()}`,
    address: '86580 Sarah Bridge',
    company: 'Farmer, Johnson and Anderson Group',
    companyEmail: 'robertscott@garcia.com',
    country: 'Cameroon',
    contact: '(775) 366-0411',
    name: 'Crystal Mays',
    service: 'Template Customization',
    total: 3325,
    avatar: '',
    avatarColor: 'primary',
    invoiceStatus: 'Paid',
    balance: '$361',
    dueDate: `02 ${currentMonth} ${now.getFullYear()}`
  },
  {
    id: '5029',
    issuedDate: `29 ${currentMonth} ${now.getFullYear()}`,
    address: '49709 Edwin Ports Apt. 353',
    company: 'Sherman-Johnson PLC',
    companyEmail: 'desiree61@kelly.com',
    country: 'Macedonia',
    contact: '(510) 536-6029',
    name: 'Nicholas Tanner',
    service: 'Template Customization',
    total: 3851,
    avatar: '',
    avatarColor: 'secondary',
    invoiceStatus: 'Paid',
    balance: 0,
    dueDate: `25 ${currentMonth} ${now.getFullYear()}`
  },
  {
    id: '5030',
    issuedDate: `07 ${currentMonth} ${now.getFullYear()}`,
    address: '3856 Mathis Squares Apt. 584',
    company: 'Byrd LLC PLC',
    companyEmail: 'jeffrey25@martinez-hodge.com',
    country: 'Congo',
    contact: '(253) 230-4657',
    name: 'Mr. Justin Richardson',
    service: 'Template Customization',
    total: 5565,
    avatar: '',
    avatarColor: 'success',
    invoiceStatus: 'Draft',
    balance: 0,
    dueDate: `06 ${currentMonth} ${now.getFullYear()}`
  },
  {
    id: '5031',
    issuedDate: `21 ${currentMonth} ${now.getFullYear()}`,
    address: '141 Adrian Ridge Suite 550',
    company: 'Stone-Zimmerman Group',
    companyEmail: 'john77@anderson.net',
    country: 'Falkland Islands (Malvinas)',
    contact: '(612) 546-3485',
    name: 'Jennifer Summers',
    service: 'Template Customization',
    total: 3313,
    avatar: '/images/avatars/6.png',
    invoiceStatus: 'Partial Payment',
    balance: 0,
    dueDate: `09 ${currentMonth} ${now.getFullYear()}`
  },
  {
    id: '5032',
    issuedDate: `31 ${currentMonth} ${now.getFullYear()}`,
    address: '01871 Kristy Square',
    company: 'Yang, Hansen and Hart PLC',
    companyEmail: 'ywagner@jones.com',
    country: 'Germany',
    contact: '(203) 601-8603',
    name: 'Richard Payne',
    service: 'Template Customization',
    total: 5181,
    avatar: '',
    avatarColor: 'error',
    invoiceStatus: 'Past Due',
    balance: 0,
    dueDate: `22 ${currentMonth} ${now.getFullYear()}`
  },
  {
    id: '5033',
    issuedDate: `12 ${currentMonth} ${now.getFullYear()}`,
    address: '075 Smith Views',
    company: 'Jenkins-Rosales Inc',
    companyEmail: 'calvin07@joseph-edwards.org',
    country: 'Colombia',
    contact: '(895) 401-4255',
    name: 'Lori Wells',
    service: 'Template Customization',
    total: 2869,
    avatar: '/images/avatars/7.png',
    invoiceStatus: 'Partial Payment',
    balance: 0,
    dueDate: `22 ${currentMonth} ${now.getFullYear()}`
  },
  {
    id: '5034',
    issuedDate: `10 ${currentMonth} ${now.getFullYear()}`,
    address: '2577 Pearson Overpass Apt. 314',
    company: 'Mason-Reed PLC',
    companyEmail: 'eric47@george-castillo.com',
    country: 'Paraguay',
    contact: '(602) 336-9806',
    name: 'Tammy Sanchez',
    service: 'Unlimited Extended License',
    total: 4836,
    avatar: '',
    avatarColor: 'warning',
    invoiceStatus: 'Paid',
    balance: 0,
    dueDate: `22 ${currentMonth} ${now.getFullYear()}`
  },
  {
    id: '5035',
    issuedDate: `20 ${currentMonth} ${now.getFullYear()}`,
    address: '1770 Sandra Mountains Suite 636',
    company: 'Foster-Pham PLC',
    companyEmail: 'jamesjoel@chapman.net',
    country: 'Western Sahara',
    contact: '(936) 550-1638',
    name: 'Dana Carey',
    service: 'UI/UX Design & Development',
    total: 4263,
    avatar: '',
    avatarColor: 'info',
    invoiceStatus: 'Draft',
    balance: '$762',
    dueDate: `12 ${currentMonth} ${now.getFullYear()}`
  },
  {
    id: '5036',
    issuedDate: `19 ${currentMonth} ${now.getFullYear()}`,
    address: '78083 Laura Pines',
    company: 'Richardson and Sons LLC',
    companyEmail: 'pwillis@cross.org',
    country: 'Bhutan',
    contact: '(687) 660-2473',
    name: 'Andrew Burns',
    service: 'Unlimited Extended License',
    total: 3171,
    avatar: '/images/avatars/8.png',
    invoiceStatus: 'Paid',
    balance: '-$205',
    dueDate: `25 ${currentMonth} ${now.getFullYear()}`
  }
]

export const pricingPlanDb: PricingPlanType[] = [
  {
    title: 'Basic',
    monthlyPrice: 0,
    currentPlan: true,
    popularPlan: false,
    subtitle: 'A simple start for everyone',
    imgSrc: '/images/illustrations/objects/pricing-basic.png',
    imgHeight: 120,
    yearlyPlan: {
      monthly: 0,
      annually: 0
    },
    planBenefits: [
      '100 responses a month',
      'Unlimited forms and surveys',
      'Unlimited fields',
      'Basic form creation tools',
      'Up to 2 subdomains'
    ]
  },
  {
    monthlyPrice: 49,
    title: 'Standard',
    popularPlan: true,
    currentPlan: false,
    subtitle: 'For small to medium businesses',
    imgSrc: '/images/illustrations/objects/pricing-standard.png',
    imgHeight: 120,
    yearlyPlan: {
      monthly: 40,
      annually: 480
    },
    planBenefits: [
      'Unlimited responses',
      'Unlimited forms and surveys',
      'Instagram profile page',
      'Google Docs integration',
      'Custom “Thank you” page'
    ]
  },
  {
    monthlyPrice: 99,
    popularPlan: false,
    currentPlan: false,
    title: 'Enterprise',
    subtitle: 'Solution for big organizations',
    imgSrc: '/images/illustrations/objects/pricing-enterprise.png',
    imgHeight: 120,
    yearlyPlan: {
      monthly: 80,
      annually: 960
    },
    planBenefits: [
      'PayPal payments',
      'Logic Jumps',
      'File upload with 5GB storage',
      'Custom domain support',
      'Stripe integration'
    ]
  }
]

export const userDb: Data = {
  // users: {
  //   profile: {
  //     about: [
  //       {
  //         property: 'Full Name',
  //          value: `${user.first_name} ${user.last_name}`,
  //         icon: 'tabler-user'
  //       },
  //       {
  //         property: 'Status',
  //          value: user.status || 'active',
  //         icon: 'tabler-check'
  //       },
  //       {
  //         property: 'Role',
  //          value: user.user_type || 'Developer',
  //         icon: 'tabler-crown'
  //       }
  //     ]
  //   }
  // }
  users: {
    profile: {
      about: [
        { property: 'Full Name', value: 'John Doe', icon: 'tabler-user' },
        { property: 'Status', value: 'active', icon: 'tabler-check' },
        { property: 'Role', value: 'Developer', icon: 'tabler-crown' },
        { property: 'Country', value: 'USA', icon: 'tabler-flag' },
        { property: 'Language', value: 'English', icon: 'tabler-language' }
      ],
      contacts: [
        { property: 'Contact', value: '(123) 456-7890', icon: 'tabler-phone-call' },
        { property: 'Skype', value: 'john.doe', icon: 'tabler-messages' },
        { property: 'Email', value: 'john.doe@example.com', icon: 'tabler-mail' }
      ],
      teams: [
        { property: 'Backend Developer', value: '(126 Members)' },
        { property: 'React Developer', value: '(98 Members)' }
      ],
      overview: [
        { property: 'Task Compiled', value: '13.5k', icon: 'tabler-check' },
        { property: 'Connections', value: '897', icon: 'tabler-users' },
        { property: 'Projects Compiled', value: '146', icon: 'tabler-layout-grid' }
      ],
      connections: [
        {
          isFriend: true,
          connections: '45',
          name: 'Cecilia Payne',
          avatar: '/images/avatars/2.png'
        },
        {
          isFriend: false,
          connections: '1.32k',
          name: 'Curtis Fletcher',
          avatar: '/images/avatars/3.png'
        },
        {
          isFriend: false,
          connections: '125',
          name: 'Alice Stone',
          avatar: '/images/avatars/4.png'
        },
        {
          isFriend: true,
          connections: '456',
          name: 'Darrell Barnes',
          avatar: '/images/avatars/5.png'
        },
        {
          isFriend: true,
          connections: '1.2k',
          name: 'Eugenia Moore',
          avatar: '/images/avatars/8.png'
        }
      ],
      teamsTech: [
        {
          members: 72,
          ChipColor: 'error',
          chipText: 'Developer',
          title: 'React Developers',
          avatar: '/images/logos/react-bg.png'
        },
        {
          members: 122,
          chipText: 'Support',
          ChipColor: 'primary',
          title: 'Support Team',
          avatar: '/images/icons/support-bg.png'
        },
        {
          members: 7,
          ChipColor: 'info',
          chipText: 'Designer',
          title: 'UI Designer',
          avatar: '/images/logos/figma-bg.png'
        },
        {
          members: 289,
          ChipColor: 'error',
          chipText: 'Developer',
          title: 'Vue.js Developers',
          avatar: '/images/logos/vue-bg.png'
        },
        {
          members: 24,
          chipText: 'Marketing',
          ChipColor: 'secondary',
          title: 'Digital Marketing',
          avatar: '/images/logos/twitter-bg.png'
        }
      ],
      projectTable: [
        {
          id: 1,
          title: 'BGC eCommerce App',
          subtitle: 'React Project',
          leader: 'Eileen',
          avatar: '/images/logos/react-bg.png',
          avatarGroup: [
            '/images/avatars/1.png',
            '/images/avatars/2.png',
            '/images/avatars/3.png',
            '/images/avatars/4.png'
          ],
          status: 78
        },
        {
          id: 2,
          leader: 'Owen',
          title: 'Falcon Logo Design',
          subtitle: 'Figma Project',
          avatar: '/images/logos/figma-bg.png',
          avatarGroup: ['/images/avatars/5.png', '/images/avatars/6.png'],
          status: 18
        },
        {
          id: 3,
          title: 'Dashboard Design',
          subtitle: 'VueJs Project',
          leader: 'Keith',
          avatar: '/images/logos/vue-bg.png',
          avatarGroup: [
            '/images/avatars/7.png',
            '/images/avatars/8.png',
            '/images/avatars/1.png',
            '/images/avatars/2.png'
          ],
          status: 62
        },
        {
          id: 4,
          title: 'Foodista Mobile App',
          subtitle: 'Xamarin Project',
          leader: 'Merline',
          avatar: '/images/icons/mobile-bg.png',
          avatarGroup: [
            '/images/avatars/3.png',
            '/images/avatars/4.png',
            '/images/avatars/5.png',
            '/images/avatars/6.png'
          ],
          status: 8
        },
        {
          id: 5,
          leader: 'Harmonia',
          title: 'Dojo React Project',
          subtitle: 'Python Project',
          avatar: '/images/logos/python-bg.png',
          avatarGroup: ['/images/avatars/7.png', '/images/avatars/8.png', '/images/avatars/1.png'],
          status: 36
        },
        {
          id: 6,
          leader: 'Allyson',
          title: 'Blockchain Website',
          subtitle: 'Sketch Project',
          avatar: '/images/logos/sketch-bg.png',
          avatarGroup: [
            '/images/avatars/2.png',
            '/images/avatars/3.png',
            '/images/avatars/4.png',
            '/images/avatars/5.png'
          ],
          status: 92
        },
        {
          id: 7,
          title: 'Hoffman Website',
          subtitle: 'HTML Project',
          leader: 'Georgie',
          avatar: '/images/logos/html-bg.png',
          avatarGroup: [
            '/images/avatars/6.png',
            '/images/avatars/7.png',
            '/images/avatars/8.png',
            '/images/avatars/1.png'
          ],
          status: 88
        },
        {
          id: 8,
          title: 'eCommerce Website',
          subtitle: 'React Project',
          leader: 'Eileen',
          avatar: '/images/logos/react-bg.png',
          avatarGroup: [
            '/images/avatars/1.png',
            '/images/avatars/2.png',
            '/images/avatars/3.png',
            '/images/avatars/4.png'
          ],
          status: 78
        },
        {
          id: 9,
          leader: 'Owen',
          title: 'Retro Logo Design',
          subtitle: 'Figma Project',
          avatar: '/images/logos/figma-bg.png',
          avatarGroup: ['/images/avatars/5.png', '/images/avatars/6.png'],
          status: 18
        },
        {
          id: 10,
          title: 'Admin Dashboard',
          subtitle: 'VueJs Project',
          leader: 'Keith',
          avatar: '/images/logos/vue-bg.png',
          avatarGroup: [
            '/images/avatars/7.png',
            '/images/avatars/8.png',
            '/images/avatars/1.png',
            '/images/avatars/2.png'
          ],
          status: 62
        }
      ]
    },
    teams: [
      {
        extraMembers: 9,
        title: 'React Developers',
        avatar: '/images/logos/react-bg.png',
        avatarGroup: [
          { avatar: '/images/avatars/1.png', name: 'Vinnie Mostowy' },
          { avatar: '/images/avatars/2.png', name: 'Allen Rieske' },
          { avatar: '/images/avatars/3.png', name: 'Julee Rossignol' }
        ],
        description:
          'We don’t make assumptions about the rest of your technology stack, so you can develop new features.',
        chips: [
          {
            title: 'React',
            color: 'primary'
          },
          {
            title: 'MUI',
            color: 'info'
          }
        ]
      },
      {
        extraMembers: 4,
        title: 'Vue.js Dev Team',
        avatar: '/images/logos/vue-bg.png',
        avatarGroup: [
          { avatar: '/images/avatars/5.png', name: "Kaith D'souza" },
          { avatar: '/images/avatars/6.png', name: 'John Doe' },
          { avatar: '/images/avatars/7.png', name: 'Alan Walker' }
        ],
        description:
          'The development of Vue and its ecosystem is guided by an international team, some of whom have chosen.',
        chips: [
          {
            title: 'Vuejs',
            color: 'success'
          },
          {
            color: 'error',
            title: 'Developer'
          }
        ]
      },
      {
        title: 'Creative Designers',
        avatar: '/images/logos/xd-bg.png',
        avatarGroup: [
          { avatar: '/images/avatars/1.png', name: 'Jimmy Ressula' },
          { avatar: '/images/avatars/2.png', name: 'Kristi Lawker' },
          { avatar: '/images/avatars/3.png', name: 'Danny Paul' }
        ],
        description:
          'A design or product team is more than just the people on it. A team includes the people, the roles they play.',
        chips: [
          {
            title: 'Sketch',
            color: 'warning'
          },
          {
            title: 'XD',
            color: 'error'
          }
        ]
      },
      {
        title: 'Support Team',
        avatar: '/images/icons/support-bg.png',
        avatarGroup: [
          { avatar: '/images/avatars/5.png', name: 'Andrew Tye' },
          { avatar: '/images/avatars/6.png', name: 'Rishi Swaat' },
          { avatar: '/images/avatars/7.png', name: 'Rossie Kim' }
        ],
        description:
          'Support your team. Your customer support team is fielding the good, the bad, and the ugly on daily basis.',
        chips: [
          {
            title: 'Zendesk',
            color: 'info'
          }
        ]
      },
      {
        extraMembers: 7,
        title: 'Digital Marketing',
        avatar: '/images/icons/social-bg.png',
        avatarGroup: [
          { avatar: '/images/avatars/1.png', name: 'Kim Merchent' },
          { avatar: '/images/avatars/2.png', name: "Sam D'souza" },
          { avatar: '/images/avatars/3.png', name: 'Nurvi Karlos' }
        ],
        description:
          'Digital marketing refers to advertising delivered through digital channels such as search engines, websites…',
        chips: [
          {
            title: 'Twitter',
            color: 'primary'
          },
          {
            color: 'success',
            title: 'Email'
          }
        ]
      },
      {
        extraMembers: 2,
        title: 'Event',
        avatar: '/images/logos/event-bg.png',
        avatarGroup: [
          { avatar: '/images/avatars/5.png', name: 'Vinnie Mostowy' },
          { avatar: '/images/avatars/6.png', name: 'Allen Rieske' },
          { avatar: '/images/avatars/7.png', name: 'Julee Rossignol' }
        ],
        description:
          'Event is defined as a particular contest which is part of a program of contests. An example of an event is the long…',
        chips: [
          {
            title: 'Hubilo',
            color: 'success'
          }
        ]
      },
      {
        title: 'Figma Resources',
        avatar: '/images/logos/figma-bg.png',
        avatarGroup: [
          { avatar: '/images/avatars/1.png', name: 'Andrew Mostowy' },
          { avatar: '/images/avatars/2.png', name: 'Micky Ressula' },
          { avatar: '/images/avatars/3.png', name: 'Michel Pal' }
        ],
        description:
          'Explore, install, use, and remix thousands of plugins and files published to the Figma Community by designers.',
        chips: [
          {
            title: 'UI/UX',
            color: 'success'
          },
          {
            title: 'Figma',
            color: 'warning'
          }
        ]
      },
      {
        extraMembers: 8,
        title: 'Only Beginners',
        avatar: '/images/logos/html-bg.png',
        avatarGroup: [
          { avatar: '/images/avatars/5.png', name: 'Kim Karlos' },
          { avatar: '/images/avatars/6.png', name: 'Katy Turner' },
          { avatar: '/images/avatars/7.png', name: 'Peter Adward' }
        ],
        description:
          'Learn the basics of how websites work, front-end vs back-end. Learn basic HTML, CSS, and JavaScript.',
        chips: [
          {
            title: 'CSS',
            color: 'info'
          },
          {
            title: 'HTML',
            color: 'primary'
          }
        ]
      },
      {
        title: 'Python Developers',
        avatar: '/images/logos/python-bg.png',
        avatarGroup: [
          { avatar: '/images/avatars/5.png', name: 'Kim Karlos' },
          { avatar: '/images/avatars/6.png', name: 'Katy Turner' },
          { avatar: '/images/avatars/7.png', name: 'Peter Adward' }
        ],
        description:
          "Harness Python's versatility for web development, data analysis & system automation for cutting-edge solutions.",
        chips: [
          {
            title: 'Python',
            color: 'info'
          }
        ]
      }
    ],
    projects: [
      {
        daysLeft: 28,
        comments: 15,
        totalTask: 344,
        hours: '380/244',
        tasks: '290/344',
        budget: '$18.2k',
        completedTask: 328,
        deadline: '28/2/22',
        chipColor: 'success',
        startDate: '14/2/21',
        budgetSpent: '$24.8k',
        members: '280 members',
        title: 'Social Banners',
        client: 'Christian Jimenez',
        avatar: '/images/icons/social-bg.png',
        description: 'We are Consulting, Software Development and Web Development Services.',
        avatarGroup: [
          { avatar: '/images/avatars/1.png', name: 'Vinnie Mostowy' },
          { avatar: '/images/avatars/2.png', name: 'Allen Rieske' },
          { avatar: '/images/avatars/3.png', name: 'Julee Rossignol' }
        ]
      },
      {
        daysLeft: 15,
        comments: 236,
        totalTask: 90,
        tasks: '12/90',
        hours: '98/135',
        budget: '$1.8k',
        completedTask: 38,
        deadline: '21/6/22',
        budgetSpent: '$2.4k',
        chipColor: 'warning',
        startDate: '18/8/21',
        members: '1.1k members',
        title: 'Admin Template',
        client: 'Jeffrey Phillips',
        avatar: '/images/logos/react-bg.png',
        avatarGroup: [
          { avatar: '/images/avatars/4.png', name: "Kaith D'souza" },
          { avatar: '/images/avatars/5.png', name: 'John Doe' },
          { avatar: '/images/avatars/6.png', name: 'Alan Walker' }
        ],
        description: "Time is our most valuable asset, that's why we want to help you save it."
      },
      {
        daysLeft: 45,
        comments: 98,
        budget: '$420',
        totalTask: 140,
        tasks: '22/140',
        hours: '880/421',
        completedTask: 95,
        chipColor: 'error',
        budgetSpent: '$980',
        deadline: '8/10/21',
        title: 'App Design',
        startDate: '24/7/21',
        members: '458 members',
        client: 'Ricky McDonald',
        avatar: '/images/logos/vue-bg.png',
        description: 'Figma dashboard app design combines the user UI & UX.',
        avatarGroup: [
          { avatar: '/images/avatars/7.png', name: 'Jimmy Ressula' },
          { avatar: '/images/avatars/8.png', name: 'Kristi Lawker' },
          { avatar: '/images/avatars/1.png', name: 'Danny Paul' }
        ]
      },
      {
        comments: 120,
        daysLeft: 126,
        totalTask: 420,
        budget: '2.43k',
        tasks: '237/420',
        hours: '380/820',
        completedTask: 302,
        deadline: '12/9/22',
        budgetSpent: '$8.5k',
        chipColor: 'warning',
        startDate: '10/2/19',
        members: '137 members',
        client: 'Hulda Wright',
        title: 'Create Website',
        avatar: '/images/logos/html-bg.png',
        description: 'Your domain name should reflect your products or services so that your...',
        avatarGroup: [
          { avatar: '/images/avatars/2.png', name: 'Andrew Tye' },
          { avatar: '/images/avatars/3.png', name: 'Rishi Swaat' },
          { avatar: '/images/avatars/4.png', name: 'Rossie Kim' }
        ]
      },
      {
        daysLeft: 5,
        comments: 20,
        totalTask: 285,
        tasks: '29/285',
        budget: '28.4k',
        hours: '142/420',
        chipColor: 'error',
        completedTask: 100,
        deadline: '25/12/21',
        startDate: '12/12/20',
        members: '82 members',
        budgetSpent: '$52.7k',
        client: 'Jerry Greene',
        title: 'Figma Dashboard',
        avatar: '/images/logos/figma-bg.png',
        description: "Time is our most valuable asset, that's why we want to help you save it.",
        avatarGroup: [
          { avatar: '/images/avatars/5.png', name: 'Kim Merchent' },
          { avatar: '/images/avatars/6.png', name: "Sam D'souza" },
          { avatar: '/images/avatars/7.png', name: 'Nurvi Karlos' }
        ]
      },
      {
        daysLeft: 4,
        comments: 98,
        budget: '$655',
        totalTask: 290,
        tasks: '29/290',
        hours: '580/445',
        completedTask: 290,
        budgetSpent: '$1.3k',
        chipColor: 'success',
        deadline: '02/11/21',
        startDate: '17/8/21',
        title: 'Logo Design',
        members: '16 members',
        client: 'Olive Strickland',
        avatar: '/images/logos/xd-bg.png',
        description: 'Premium logo designs created by top logo designers. Create the branding.',
        avatarGroup: [
          { avatar: '/images/avatars/8.png', name: 'Kim Karlos' },
          { avatar: '/images/avatars/1.png', name: 'Katy Turner' },
          { avatar: '/images/avatars/2.png', name: 'Peter Adward' }
        ]
      }
    ],
    connections: [
      {
        tasks: '834',
        projects: '18',
        isConnected: true,
        connections: '129',
        name: 'Mark Gilbert',
        designation: 'UI Designer',
        avatar: '/images/avatars/1.png',
        chips: [
          {
            title: 'Figma',
            color: 'secondary'
          },
          {
            title: 'Sketch',
            color: 'warning'
          }
        ]
      },
      {
        tasks: '2.31k',
        projects: '112',
        isConnected: false,
        connections: '1.28k',
        name: 'Eugenia Parsons',
        designation: 'Developer',
        avatar: '/images/avatars/2.png',
        chips: [
          {
            color: 'error',
            title: 'Angular'
          },
          {
            color: 'info',
            title: 'React'
          }
        ]
      },
      {
        tasks: '1.25k',
        projects: '32',
        isConnected: false,
        connections: '890',
        name: 'Francis Byrd',
        designation: 'Developer',
        avatar: '/images/avatars/3.png',
        chips: [
          {
            title: 'HTML',
            color: 'primary'
          },
          {
            color: 'info',
            title: 'React'
          }
        ]
      }
    ]
  },
  profileHeader: {
    fullName: 'John Doe',
    location: 'Vatican City',
    joiningDate: 'April 2021',
    designation: 'UX Designer',
    profileImg: '/images/avatars/1.png',
    designationIcon: 'tabler-palette',
    coverImg: '/images/pages/profile-banner.png'
  }
}
