import React, { ReactNode } from 'react';

import { CREATE_BRANCH_FORM_ID } from '../constants';

type CreateBranchFormProps = {
  children: ReactNode;
};

export class CreateBranchForm extends React.PureComponent<
  CreateBranchFormProps
> {
  handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  render() {
    return (
      <form id={CREATE_BRANCH_FORM_ID} onSubmit={this.handleSubmit}>
        {this.props.children}
      </form>
    );
  }
}
