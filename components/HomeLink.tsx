import styled from '@emotion/styled'
import Image from 'next/image'
import Link from 'next/link'
import React, { FC } from 'react'

const Container = styled.div`
   position: relative;
   cursor: pointer;
   width: 60px;
   height: 60px;
   padding: 5px;

   &::after {
      content: '';
      position: absolute;
      z-index: -1;

      background: #eee;
      border-radius: 999px;
      transition: height 0.05s linear, width 0.05s linear;

      height: 0;
      width: 0;

      top: 50%;
      left: 50%;
      transform: translate(-60%, -60%);
   }

   img {
      transition: filter 0.05s linear;
   }

   &:hover {
      img {
         filter: invert();
      }
      &::after {
         height: 400%;
         width: 400%;
      }
   }
`

const HomeLink: FC = () => (
   <Container>
      <Link href='/'>
         <Image src='/icon.png' height={50} width={50} />
      </Link>
   </Container>
)

export default HomeLink
