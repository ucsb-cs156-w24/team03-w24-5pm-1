import React from 'react';
import ArticlesForm from "main/components/Articles/ArticlesForm"
import { ArticlesFixtures } from 'fixtures/ArticlesFixtures';

export default {
    title: 'components/Articles/ArticlesForm',
    component: ArticlesForm
};


const Template = (args) => {
    return (
        <ArticlesForm {...args} />
    )
};

export const Create = Template.bind({});

Create.args = {
    buttonLabel: "Create",
    submitAction: (data) => {
        console.log("Submit was clicked with data: ", data);
        window.alert("Submit was clicked with data: " + JSON.stringify(data));
   }
};

export const Update = Template.bind({});

Update.args = {
    initialContents: ArticlesFixtures.oneArticle,
    buttonLabel: "Update",
    submitAction: (data) => {
        console.log("Submit was clicked with data: ", data);
        window.alert("Submit was clicked with data: " + JSON.stringify(data));
   }
};
