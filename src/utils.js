function hasPermission(user,permissionNeeded) {
    const matchedPermissions = user.permissions.filter(permissionTheyHave =>
        permissionNeeded.includes(permissionTheyHave)
    );
    if (!matchedPermissions.length){
        throw  new Error(`You do not have sufficient permissions

        : ${permissionNeeded}
        
        You have:

        ${user.permissions}
        
        `);
    }

    }
exports.hasPermission = hasPermission;