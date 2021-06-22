import styled from '@emotion/styled'
import { GetServerSideProps } from 'next'
import Image from 'next/image'
import { darken } from 'polished'
import { FC } from 'react'
import Copy from '../../../components/Copy'
import Layout from '../../../components/Layout'
import LinkButton from '../../../components/LinkButton'
import Title from '../../../components/Title'
import database, { serialize } from '../../../database'
import Pack, { IPack } from '../../../database/models/Pack'

const PackView: FC<IPack> = ({ name, assets, links, description, slug }) => {
   return (
      <Layout title={name} image={assets?.icon} description={description}>

         <Title subtitle={{ link: `/${slug}`, name }}>Install using Technic</Title>

         {links?.technic
            ? <Steps>

               <Step mark={1} title='Download technic launcher' image='/technic/icon.png'>
                  <LinkButton target='_blank' rel='noreferrer' href='https://www.technicpack.net/download'>Download the launcher</LinkButton>
               </Step>

               <Step mark={2} title='Search for modpack' image={'/technic/search.png'}>
                  <List>
                     <li>
                        <Copy content={links.technic}>Copy link</Copy>
                        <span>and paste it in the search bar</span>
                     </li>
                     <li>Select pack and click install</li>
                  </List>
               </Step>

               <Step mark={3} title='Set RAM requirements' image={'/technic/settings.png'}>
                  <h4>If this is your first time using technic:</h4>
                  <List>
                     <li>Click <i>Launcher options</i></li>
                     <li>Select <i>Java Settings</i></li>
                     <li>Choose 4GB Memory or more</li>
                  </List>
               </Step>

            </Steps>

            : <p>Not installable using technic</p>
         }

      </Layout>
   )
}

const List = styled.ul`
   list-style: disc;
   text-align: left;

   * + & {
      margin-top: 1rem;
   }
   
   li:not(:last-of-type) {
      margin-bottom: 0.8rem;
   }
`

const Step: FC<{
   image: string
   title: string
   mark: number
}> = ({ image, title, mark, children }) => (
   <li>
      <Mark>{mark}.</Mark>
      <h2>{title}</h2>

      {image.startsWith('/api')
         ? <img src={image} alt={title} />
         : <Image src={image} alt={title} width={500} height={500} layout='responsive' />
      }

      <div className='content'>{children}</div>
   </li>
)

const Mark = styled.p`
   font-size: 1.8rem;
   width: 2.9rem;
   padding: 0.4rem;
   background: ${p => darken(0.05, p.theme.bg)};
   border-radius: 9999px;
   position: absolute;
   left: 1rem;
   top: 3rem;
   z-index: 1;
`

const Steps = styled.ul`
   display: grid;
   grid-auto-flow: column;
   grid-auto-columns: 500px;
   justify-content: center;
   padding: 2rem;
   gap: 2rem;

   & > li {
      position: relative;
      text-align: center;
      transition: all 0.1s linear;
      padding: 3rem;
      font-size: 1.2rem;

      display: grid;
      justify-content: center;
      align-items: flex-start;
      gap: 1rem;
      grid-template: 
         "image" 300px
         "header"
         "content";

      & > div:not(.content), & > img {
         grid-area: image;
         width: calc(500px - 8rem);
         height: 100%;
      }

      h2 {
         grid-area: header;
      }

      .content {
         grid-area: content;
         padding-top: 2rem;
      }
   
      &:hover {
         background: #0002;
      }
   }
`

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
   await database()

   const [pack] = await Pack.aggregate<IPack>([
      {
         $project: {
            name: true,
            slug: true,
            links: true,
            assets: true,
            description: true
         }
      },
      { $match: { slug: params?.pack } },
   ])

   if (!pack) return { notFound: true }

   return { props: serialize(pack) }
}

export default PackView
