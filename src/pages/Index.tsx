import { SchemaPilot } from "@/components/SchemaPilot";
import { useEffect } from "react";
import { v4 as uuid } from 'uuid';

const Index = () => {

  useEffect(() => {
    if (!localStorage.getItem('userId')) {
      localStorage.setItem('userId', uuid());
    }
  }, []);

  return <SchemaPilot />;
};

export default Index;
