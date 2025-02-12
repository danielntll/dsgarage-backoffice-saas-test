import { typeContextStatus } from "../../types/typeContextStatus";
import ItemEmpty from "../Item__Empty/ItemEmpty";
import ItemError from "../Item__Error/ItemError";
import ItemLoading from "../Item__Loading/ItemLoading";

interface ContainerProps {
  status: typeContextStatus | null;
  dataLength: number;
  children: React.ReactNode;
}

const StatusData: React.FC<ContainerProps> = ({
  status,
  dataLength,
  children,
}) => {
  //VARIABLES ------------------------
  //USE STATES -----------------------
  //USE EFFECTS ----------------------
  //FUNCTIONS ------------------------
  //RETURN COMPONENT -----------------
  switch (status?.status) {
    case "loading":
      return <ItemLoading />;
    case "error":
      return <ItemError />;
    case "success":
      if (dataLength === 0) {
        return <ItemEmpty />;
      } else {
        return children;
      }
    default:
      return <ItemLoading />;
  }
};

export default StatusData;
