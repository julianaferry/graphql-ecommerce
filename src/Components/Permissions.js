import { Query, Mutation } from 'react-apollo';
import Error from './ErrorMessage';
import gql from 'graphql-tag';
import Table from './styles/Table';
import ButtonStyles from './styles/ButtonStyles';
import PropTypes from 'prop-types';
import { check } from 'graphql-anywhere';

const possiblePermissions = [
    'ADMIN',
    'USER',
    'ITEMCREATE',
    'ITEMUPDATE',
    'ITEMDELETE',
    'PERMISSIONUPDATE',
];

const UPDATE_PERMISSIONS_MUTATION = gql `
 mutation UpdatePermissions($permissions:[Permissions], $userId:ID!){
     updatePermissions (permissiona: $permissions, userId: $userId){
         id
         permissions
         name
         email
        }
    }
`;

const  ALL_USERS_QUERY = gql `
    query {
        users {
            id
            name
            email
            permissiona
        }
    }
`;

  const Permissions = props => {
      <Query query={ALL_USERS_QUERY}>
        {({data, loading, error}) => {
            <div>
                <Error error={error}/>
                <div>
                    <h2>Manage Permissions</h2>
                    <Table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                {possiblePermissions.map(permission => <th key={permission}>{permission}</th>)}
                                <th>👇</th>
                            </tr>
                        </thead>
                        <tbody>{data.users.map(user => <UserPermissions user={user} key={user.id} />)}</tbody>
                    </Table>
                </div>
            </div>
        }}
      
      </Query>
  };

  class UserPermissions extends React.Component {
      static propTypes = {
          user: PropTypes.shape({
              name: PropTypes.string,
              email:PropTypes.string,
              id:PropTypes.string,
              permissions: PropTypes.array,
          }).isRequired,
      };

      state = {
          permissions: this.props.user.permissions,
      };

      handlePermissionChange = (e) =>{
          const checkbox = e.target;
          //take a copy of he current permissions
          let = updatePermissions = [...this.state.permissions];
          //figure out if we need to remove or add this permission
          if(checkbox.checked) {
              //add it in!
              updatePermissions.push(checkbox.value);
          } else {
              updatePermissions = updatePermissions.filter(permission => permission !==  checkbox.value);
          }
          this.setState({permissions: updatePermissions});
      };

      render() {
          const user = this.props.user;

          return(
            <Mutation 
            mutation={UPDATE_PERMISSIONS_MUTATION} 
            variables={{
                permissions:this.state.permissions,
                userId: this.props.id,
            }}
            >
            {(updatePermissions, {loading, error}) => (
                <>
                    {error && <tr><td colSpan="8"><Error error={error}/> </td></tr>}
                    <tr>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        {possiblePermissions.map(permission => (
                            <td key={permissions}>
                                <label htmlFor={`${user.id}-permission-${permission}`}>
                                    <input
                                    id={`${user.id}-permission-${permission}`}
                                    type="checkbox"
                                    checked={this.state.permissions.include(permission)}
                                    value={permission}
                                    onChange={this.handlePermissionChange}
                                    />
                                </label>
                            </td>
                        ))}
                        <td>
                            <ButtonStyles type="button" disabled={loading} onClick={updatePermissions}>
                                Updat{loading ? 'ind' : 'e'}
                            </ButtonStyles>
                        </td>
                    </tr>
                </>
            )}
            </Mutation>
          );
      }
  }

  export default Permissions;