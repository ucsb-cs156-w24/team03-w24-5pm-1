import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import MenuItemReviewForm from "main/components/MenuItemReview/MenuItemReviewForm";
import { Navigate } from 'react-router-dom'
import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function MenuItemReviewCreatePage({storybook=false}) {

  const objectToAxiosParams = (menuItemReview) => ({
    url: "/api/MenuItemReview/post",
    method: "POST",
    params: {
     itemId: menuItemReview.itemId,
     reviewerEmail: menuItemReview.reviewerEmail,
     stars: menuItemReview.stars,
     dateReviewed: menuItemReview.dateReviewed,
     comments: menuItemReview.comments
    }
  });

  const onSuccess = (menuItemReview) => {
    toast(`New menu item review Created - id: ${menuItemReview.id} itemId: ${menuItemReview.itemId}`);
  }

  const mutation = useBackendMutation(
    objectToAxiosParams,
     { onSuccess }, 
     // Stryker disable next-line all : hard to set up test for caching
     ["/api/MenuItemReview/all"] // mutation makes this key stale so that pages relying on it reload
     );
    
    const { isSuccess } = mutation

  const onSubmit = async (data) => {
    mutation.mutate(data);
  }

  if (isSuccess && !storybook) {
    return <Navigate to="/MenuItemReview" />
  }

  // Stryker disable all : placeholder for future implementation
  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Create New Menu Item Review</h1>
        <MenuItemReviewForm submitAction={onSubmit} />
      </div>
    </BasicLayout>
  )
}
