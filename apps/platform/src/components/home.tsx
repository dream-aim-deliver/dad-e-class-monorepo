'use client';
import { Button } from '@maany_shr/e-class-ui-kit';
import '@maany_shr/e-class-ui-kit/tailwind.css';
import { useTheme } from '@maany_shr/e-class-ui-kit/contexts';
export interface HomeProps {
  serverSideParam: string;
}

export default function Home(props: HomeProps) {
  const {theme, setTheme} = useTheme();
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <p className="text-center">Cool things happen here</p>
      <Button
        variant="primary"
        size="medium"
        onClick={() => {
          console.log('Clicked: ' + theme);
          setTheme(theme === 'orange' ? 'blue' : 'orange')

        }}
      >
        Click me
      </Button>
    </div>
  );
}
