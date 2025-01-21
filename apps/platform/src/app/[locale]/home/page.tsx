import { Button } from '@maany_shr/e-class-ui-kit'
import React from 'react'

export default function page() {
    return (
        <>
            <div className="flex flex-col items-center font-extrablack text-button-primary-fill text-lg justify-center">
                <h1> Home page </h1>
            </div>
            <div className='flex flex-col  justify-center items-center mt-10'>
              <Button variant="secondary" size="huge"> Click me</Button>
            </div>
        </>
    )
}
