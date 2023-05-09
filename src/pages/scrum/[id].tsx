import React from "react";
import { useRouter } from "next/router";

const Scrum = () => {
  const router = useRouter();
  const { id } = router.query;
  return <div>{id}</div>;
};

export default Scrum;
