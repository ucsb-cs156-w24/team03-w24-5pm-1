import RecommendationRequestForm from "main/components/RecommendationRequests/RecommendationRequestForm";
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useBackendMutation } from "main/utils/useBackend";
import { Navigate } from 'react-router-dom';
import { toast } from "react-toastify";

export default function RecommendationRequestCreatePage({storybook=false}) {
  const objectToAxiosParams = (recommendationRequest) => ({
    url: "/api/RecommendationRequest/post",
    method: "POST",
    params: {
     requesterEmail: recommendationRequest.requesterEmail,
     professorEmail: recommendationRequest.professorEmail,
     explanation: recommendationRequest.explanation,
     dateRequested: recommendationRequest.dateRequested,
     dateNeeded: recommendationRequest.dateNeeded,
     done: recommendationRequest.done
    }
  });

  const onSuccess = (recommendationRequest) => {
    toast(`New RecommendationRequest Created - id: ${recommendationRequest.id}, explanation: ${recommendationRequest.explanation}`);
  }

  const mutation = useBackendMutation(
    objectToAxiosParams,
     { onSuccess },
     ["/api/RecommendationRequest/all"]
  );
  
  const { isSuccess } = mutation

  const onSubmit = async (data) => {
    mutation.mutate(data);
  }
  if (isSuccess && !storybook) {
    return <Navigate to="/RecommendationRequest" />
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Create New Recommendation Request</h1>
        <RecommendationRequestForm submitAction={onSubmit}/>
      </div>
    </BasicLayout>
  )
  }