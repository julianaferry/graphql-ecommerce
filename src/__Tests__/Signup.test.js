import { ApolloConsumer } from 'react-apollo';
import Signup, { SIGNUP_MUTATION } from '../components/Signup';
import { CURRENT_USER_QUERY } from '../components/User';
import { fakeUser } from '../lib/testUtils';
import { type } from 'os';

function type(wrapper, name, value){
    wrapper.find(`input[name = "${name}"]`).simulate('change', {
        target: {
            name,
            value,
        },
    });
}

const me = fakeUser();
const mocks = [
    //signup mock mutation
    {
    request: {
        query: SIGNUP_MUTATION,
        variables: {
            name: me.name,
            email: me.email,
            password: 'ju',
        },
    },
    result: {
        data: {
            signup: {
                __typename: 'User',
                id: 'abc123',
                email:'me.email',
                name: 'me.name',
                },
            },
        },
    },
    {
        request: { query: CURRENT_USER_QUERY },
        result: { data: {me} },
    },
];

describe('<Signup/>', () => {
    it('renders and matches snapshot', async() => {
        const wrapper = mount (
            <MockedProvider>
                <Signup/>
            </MockedProvider>
        );
        expect(toJSON(wrapper.find('form'))).toMatchSnapshot();
    });

    it ('calls the mutation properly', async() => {
        let apolloClient;

        const wrapper = mount(
            <MockedProvider mocks={mocks}>
                <ApolloClient>
                    {client => {
                        apolloClient = client;
                        return <Signup/>;
                    }}
                </ApolloClient>
            </MockedProvider>
        );

        await wait();
        wrapper.update();

        type(wrapper, 'name', me.name);
        type(wrapper, 'email', me.email);
        type(wrapper, 'password', 'ju');
        wrapper.update();
        wrapper.find('form').simulate('submit');
        await wait();

        //query the user out of the apollo client
        const user = await apolloClient.query({query: CURRENT_USER_QUERY});
        expect(user.data.me).toMatchObject(me);
    });
});