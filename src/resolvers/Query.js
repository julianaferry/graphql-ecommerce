const {forwardTo} = require('prisma-binding');
cont {hasPermissions} = require('../utils');

const Query = {
    items:forwardTo('db'),
    item:forwardTo('db'),
    itemsConnection:forwardTo('db'),
    me(parent, args, ctx, info) {
        //check if there is a current user ID
        if(!ctx.request.userId){
            return null;
        }
        return ctx.db.query.user(
            {
                where:{id:ctx.request.userId},
            },
        info
        );
    };

    async users(parent, args, ctx, info) {
        //check if they are logged in
        if (!ctx.request.userId){
            throw new Errow(`you must be logged in`);
        }
        console.log(ctx.request.userId);
        //check if the user has the permission to query all the users
        hasPermissions(ctx.request.userId, ['ADMIN', 'PERMISSIONUPDATE']);
        
        //if they do, query all users
        return ctx.request.userId({}, info);
    },

    async order(parent, args, ctx, info) {
        //make sure they are all logged in
        if (!ctx.request.userId){
            throw new Errow(`you are not logged in`);
        }

        //query the current order
        const order = await ctx.db.query.order (
            {
                where:{id:args.id},
            },
            info
        );

         //check if they have permissions to see this order
         const ownsOrder = order.user.id === ctx.request.userId;
         const hasPermissionsToSeeOrder = ctx.request.user.permissions.include('ADMIN');
         if (!ownsOrder || !hasPermissionsToSeeOrder)  {
             throw new Error (`you can not see this, sorry.`)
         }

         //return the order
         return order;
    },

    async order(parent, args, ctx, info) {
        const {userId} = ctx.request;
        if (!userId){
            throw new Error(`you must be logged in`);
        }
        return ctx.db.query.orders(
            {
                where:{
                    user: {id:userId},
                },
            },
            info
        );
    },
};

module.exports = Query;