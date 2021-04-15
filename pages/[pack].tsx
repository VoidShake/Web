import { GetServerSideProps } from 'next'
import { FC } from 'react'
import Layout from '../components/Layout'
import Modlist from '../components/Modlist'
import Title from '../components/Title'
import { getMod } from '../curseforge'
import database from '../database'
import IMod from '../interfaces/mod'
import IPack from '../interfaces/pack'

const PackView: FC<{ mods: IMod[], name: string }> = ({ mods, name }) => {

  return (
    <Layout title={name}>

      <Title>{name}</Title>

      <Modlist mods={mods} />

    </Layout>
  )
}

/*
export const getStaticPaths: GetStaticPaths = async () => {

  const { db } = await database()
  const packs: IPack[] = await db.collection('packs').find().toArray()

  const paths = packs.map(({ name }) => ({
    params: { pack: name }
  }))

  return { paths, fallback: false }
}
*/

export const getServerSideProps: GetServerSideProps = async ({ params }) => {

  const { db } = await database()

  const name = params?.pack
  const { installedAddons }: IPack = await db.collection('packs').findOne({ name })

  const addons: Array<Partial<IMod> & { id: number }> = installedAddons
    .filter(a => a.installedFile.categorySectionPackageType !== 3)
    .map(({ addonID }) => ({
      id: addonID,
      library: installedAddons.some(a => a.installedFile.dependencies.some(d => d.addonId === addonID))
    }))

  const mods: IMod[] = await Promise.all(addons.map(async a => {
    const { attachments, primaryCategoryId, categories, ...mod } = await getMod(a.id)

    const libIds = [421, 425, 423, 435]

    return {
      ...a, ...mod,
      library: !!(a.library && [421, 425].includes(primaryCategoryId) && categories.every(c => libIds.includes(c.categoryId))),
      icon: attachments.find(a => a.isDefault)?.thumbnailUrl
    }
  }))

  const sorted = mods.sort((a, b) => {
    const [ia, ib] = [a, b].map(x => x.library ? 100000000000 : 0)
    return (ia - ib) + (b.popularityScore - a.popularityScore)
  })

  return { props: { mods: sorted, name } }

}

export default PackView