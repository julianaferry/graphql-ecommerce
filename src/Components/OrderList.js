import React from 'react';
import { Query } from 'react-apollo';
import { formatDistance } from 'date-fns';
import Link from 'next/link';
import styled from 'styled-components';
import gql from 'graphql-tag';
import Error from './ErrorMessage';
import formatMoney from '../lib/formatMoney';
import OrderItemStyles from './styles/OrderItemStyles';

const USER_ORDERS_QUERY = gql `
    query USER_ORDERS_QUERY {
        orders(orderBy: createdAt_DESC) {
            id
            total
            createdAt
            items {
                id
                title
                price
                description
                quantity
                image
            }
        }
    }
`;

const orderUl = styled.ul `
    display:grid;
    grid-gap:4rem;
    grid-template-columns: repeat(auto-fit, minmax(40%, 1fr));
`;

class OrderList extends React.Component {
    render() {
        return (
            <Query query={USER_ORDERS_QUERY}>
            { ({data: {orders}, loading, error}) => {
                if(loading) return <p>loading...</p>;
                if(error) return <Error error={error}/>;
                console.log(orders);

                return (
                    <h2>You have {orders.length} orders</h2>
                    <orderUl>
                        {orders.map( order => (
                            <OrderItemStyles key={order.id}>
                                <Link href={{
                                   pathname: '/order',
                                   query:{id:order.id},
                                }}
                                >
                                <a>
                                    <div className="oder-meta">
                                    <p>{order.items.reduce ((a,b) => a + b.quantity, 0)}Items</p>
                                    <p>{orders.items.length} Products</p>
                                    <p>{formatDistance (order.createdAt, new Date())}</p>
                                    <p>{formatMoney(orders.total)}</p>
                                    </div>
                                        <div className="images">
                                        {orders.items.map(item => (
                                            <img key={item.id} src={item.image} alt={item.title}/>
                                        ))}
                                         </div>           
                                </a>
                                </Link>
                            </OrderItemStyles>
                        ))}
                    </orderUl>
                );
            }}
            </Query>
        );
    }
}

export default OrderList;
export { USER_ORDERS_QUERY};