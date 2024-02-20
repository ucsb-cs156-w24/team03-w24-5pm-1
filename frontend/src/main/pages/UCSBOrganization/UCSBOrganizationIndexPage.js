import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useCurrentUser , hasRole} from 'main/utils/currentUser'
import { Button } from 'react-bootstrap';
import UCSBOrganizationTable from "main/components/UCSBOrganization/UCSBOrganizationTable";
import React from 'react'
import { useBackend } from 'main/utils/useBackend';

export default function UCSBOrganizationIndexPage() {

  const currentUser = useCurrentUser();

  const { data: organizations, error: _error, status: _status } =
      useBackend(
          
          ["/api/ucsborganization/all"],
          { method: "GET", url: "/api/ucsborganization/all" },
         
          []
      );

  const createButton = () => {
      if (hasRole(currentUser, "ROLE_ADMIN")) {
          return (
              <Button
                  variant="primary"
                  href="/ucsborganization/create"
                  style={{ float: "right" }}
              >
                  Create Organization
              </Button>
          )
      } 
  }

  return (
      <BasicLayout>
          <div className="pt-2">
              {createButton()}
              <h1>Organizations</h1>
              <UCSBOrganizationTable organizations={organizations} currentUser={currentUser} />
          </div>
      </BasicLayout>
  );
}
