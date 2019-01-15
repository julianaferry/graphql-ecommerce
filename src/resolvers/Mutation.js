const bcrypt = require ('bcryptjs');
const jwt = require('jsonwebtoken');
const {randomBytes}  = require('crypto');
const {promisify} = require('util');
const {transport, makeEmail} = require('../mail');
const {hasPermission} = require('../utils');
const stripe = require('../stripe');

const Mutation = {
    async createItem(parent, args, ctx, info) {
        if (!ctx.request.userId) {
            throw new Error('You must be logged in to do that!');
        }
        const item = await ctx.request.mutation.createItem (
            {
                data: {
                    //this is how to create a relantionship between the item and the user
                    user:{
                        connect:{
                            id:ctx.request.userId,
                        },
                    },
                    ...args,
                },
            },
            info
        );
        console.log(items);
        return item;
    },
    
    updateItem(parent,args,ctx,info) {
        //first take a copy of the update
        const update = {...args};
        //remove the id from the updates
        delete update.id;
        //run the update method
        return ctx.request.mutation.updateItem(
            {
                data: updates,
                where: {
                    id:args.id,
                },
            },
            info
        );
    },

    async deleteItem(parent, args, ctx, info) {
        const where = {id: args.id};
        //find the item
        const item = await ctx.db.query.item(
            {where}, 
            `{ id title user {id} }`
        ); 

        //check if they own that item, or have the permissions
        const ownsItem = item.user.id === ctx.request.userId;
        const hasPermissions =  ctx.request.user.permissions.some(permission =>
            ['ADMIN, ITEMDELETE'].includes(permission)
            );

            if (!ownsItem && !hasPermissions){
                throw new Error("you dont have permission to do that!");
            }
            //delete it
            return ctx.db.mutation.deleteItem({where},info);
    },

    async sigup(parent,args,ctx,info){
        //lowercase email
        args.email = args.email.toLowerCase();
        //hash their password
        const password = await bcrypt.hash(args.password, 10);
        //create the user in the database
        const user = await ctx.db.mutation.createUser(
            {
                data: {
                    ...args,
                    password,
                    permission: {set:['USER']},
                },
            },
            info
        );

        //create JWT token for them
        const token = jwt.sign({userId:userId}, process.env.APP_SECRET);
        //set jwt as cookie on the response
        ctx.response.cookie('token', token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 365, //1 year of cookie
        });
        return user;
    },
// args are the email and password
    async signin (parent, {email, password}, ctx, info) {
        //check if there is a user with that email
        const user = await ctx.db.query.user({where: {email} });
        if (!user){
            throw new Error (`no such user found for email ${email}`);
        }
        //check if their password is correct
        const valid = await bcrypt.compare(password, user.password);
        if (!valid){
            throw new Error ('invalid password');
        }

        //generate the jwt token
        const token = jwt.sign({userId:user.id}, process.env.APP_SECRET);
        //set the cookie with the token
        ctx.response.cookie('token', token,{
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 365, //1 year of cookie
        });
        //return the user
        return user;
    },

    async requestReset (parent,args,ctx,info) {
        //check if this is a real user
        const user = await ctx.db.query.user({ where:{email:args.email} });
        if (!user) {
            throw new Error(`no user found for email ${args.email}`);      
        }
       
        //set the request token and expiry on that user
        const randomBytesPromiseified = promisify(randomBytes);
        const resetToken = (await randomBytesPromiseified(20)).toString('hex');
        const resetTokenExpiry = Date.now() + 3600000; //1 year from now
        const res = await ctx.db.mutation.updateUser({
            where:{email: args.email},
            data:{resetToken, resetTokenExpiry},
        });

        // email them that reset token
        const mailRes = await transport.sendMail({
            from:'julianaferry@gmail.com',
            to: user.email,
            subject:'your reset passoword token',
            html:makeEmail(`your passowrok token is here
            \n\n
            <a href="${process.env.FRONT_URL}/reset?resetToken=${resetToken}">
            Click here</a>`),
        });

        //return the message
        return{message: 'thanks'};
    },

    async reserPassword(parent, args, ctx, info){
        //check if the passwords match
        if (args.password !== args.confirm.password){
            throw new Error ('your password dont match');
        }
        //check if its a legit token
        //check if its expired
        const [user] = await ctx.db.query.users({
            where:{
                resetToken: args.resetToken,
                resetTokenExpiry_gte:Date.now() - 3600000,
            },
        });
        if (!user){
            throw new Error('this token is either invalid or expired');
        }

        //hash their password
        const password = await bcrypt.hash(args.password,10);
        //save the new password to the user and remove te old resettoken fields
        const updateUser = await ctx.db.mutation.updateUser({
            where: { email: user.email },
            data:{
                password,
                resetToken: null,
                resetTokenExpiry: null,
            },
        });
            //generate JWT
            const token = jwt.sign({userId: updateUser.id}.process.env.APP_SECRET);
            //set the jwt cookie
            ctx.response.cookie('token', token, {
                http: true,
                maxAge:1000 * 60 * 60 * 24 * 365,
            });
            //return new user
            return updateUser;
    },
    async updatePermissions(parent, args, ctx, info){
        //check if they are logged in
        if(!ctx.request.userId){
            throw new Error('you must be looged in');
        }
        //query the current user
        const currentUser = await ctx.db.query.user(
            {
                where:{
                    id:ctx.request.userId
                },
            },
            info
        );
        //check if they have permissions to do this
        hasPermission(currentUser, ['ADMIN', 'PERMISSIONUPDATE']);
        //update the permissions
        return ctx.db.mutation.updateUser(
            {
                data: {
                    permissions:{
                        set:args.permissions,
                    },
                },
                where: {
                    id:args.userId,
                },
            },
            info
        );
    },

    async addToCart(parent, args, ctx, info){
        //make sure they are looged in
        cont {userId} = ctx.request;
        if(!userId) {
            throw new Error('you must be logged in');
        }
        //query the users current cart
        const [existingCartItem] = await ctx.db.query.createItems({
            where: {
                user: {id:userId},
                item: {id:args.id},
            },
        });
        //check if that item is already in their cart and increment it by 1 if it is
        if(existingCartItem){
            console.log('this item is already in their cart');
            return ctx.db.mutation.updateCartItem({
                where:{
                    id:existingCartItem.id
                },
                data:{
                    quantity: existingCartItem.quantity + 1
                },
            },
            info
            );
        }

        //if it is not, create a freshCartItem for the user
        return db.mutation.createCartItem({
            data:{
                user: {
                    connect: {
                        id: userId
                    },
                },
                item:{
                    connect: args.id
                },
            },
        },
        info
        );
    },

    async RemoveFromCart(parent, args, ctx, info){
        //find the cart item
        const CartItem = await ctx.db.query.CartItem({
            where:{
                id:args.id,
            },
        },
        `{id, user{id}}`
        );
        //make sure we found an item
        if(!CartItem) throw new Error('no cartItem found');
        //make sure they dont own that cart item
        if(!CartItem.user.id !== ctx.request.userId){
            throw new Error ('no cheating!');
        }
        //delete the cart item
        return ctx.db.mutation.deleteCartItem({
            where: {
                id:args.id
            },
        },
        info
        );
    },

    async createOrder(parent, args, ctx, info){
        //query the current user and make sure they are logged in
        const{userId} = ctx.request;
        if(!userId) throw new Error ('you must be signed in to complete this order.');

        const user = await ctx.db.query.user({
            where:{
                id:userId
            }
        },
        `{id name email cart{id, quantity, item{title price id description image largeImage} } }`
        );

        //recalculate the total for the price
        const amount = user.cart.reduce(
            (tally, cartItem) => tally + cartItem.item.price * cartItem.quantity,
            0
        );
        console.log(`going to charge for a total of ${amount})`;
        //create the stripe charge (turn toke into $)
        const charge = await stripe.charges.create({
            amount,
            currency: 'USD',
            source: args.token,
        });
        //convert the cartItems to OrderItems
        const orderItems = user.cart.map(cartItem => {
            const orderItem = {
                ...cartItem.item,
                quantity: cartItem.quantity,
                user:{
                    connect: {
                        id:userId
                    }
                },
            };
            delete orderItem.id,
            return orderItem;
        });
        //create the order
        const order = await ctx.db.mutation.createOrder({
            data: {
                total: charge.amount,
                charge: charge.id,
                items: {
                    create: orderItems
                },
                user: {
                    connect: {
                        id:userId
                    }
                },
            },
        });
        //clean up - clear the users cart, delete cartItems
        const cartItemIds = user.cart.map(cartItem => cartItem.id);
        await ctx.db.mutation.deleteManyCartItems({
            where: {
                id_in: cartItemIds,
            },
        });
           //return order to the client
           return order;
    },
};

module.exports = Mutations;