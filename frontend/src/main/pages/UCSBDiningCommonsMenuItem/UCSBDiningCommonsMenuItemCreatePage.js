import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import UCSBDiningCommonsMenuItemForm  from "main/components/UCSBDiningCommonsMenuItem/UCSBDiningCommonsMenuItemForm";
import { Navigate } from 'react-router-dom'
import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function UCSBDiningCommonsMenuItemCreatePage({storybook=false}) {

  const objectToAxiosParams = (ucsbdiningcommonsmenuitems) => ({
    url: "/api/UCSBDiningCommonsMenuItem/post",
    method: "POST",
    params: {
     diningCommonsCode: ucsbdiningcommonsmenuitems.diningCommonsCode,
     name: ucsbdiningcommonsmenuitems.name,
     station: ucsbdiningcommonsmenuitems.station
    }
  });

  const onSuccess = (ucsbdiningcommonsmenuitems) => {
    toast(`New UCSB dining commons menu item Created - id: ${ucsbdiningcommonsmenuitems.id} name: ${ucsbdiningcommonsmenuitems.name}`);
  }

  const mutation = useBackendMutation(
    objectToAxiosParams,
     { onSuccess }, 
     // Stryker disable next-line all : hard to set up test for caching
     ["/api/UCSBDiningCommonsMenuItem/all"] // mutation makes this key stale so that pages relying on it reload
     );

  const { isSuccess } = mutation

  const onSubmit = async (data) => {
    mutation.mutate(data);
  }

  if (isSuccess && !storybook) {
    return <Navigate to="/diningcommonsmenuitem" />
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Create New UCSB Dining Commons Menu Item</h1>
        <UCSBDiningCommonsMenuItemForm submitAction={onSubmit} />
      </div>
    </BasicLayout>
  )
}
