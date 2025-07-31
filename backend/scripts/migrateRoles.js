import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const migrateRoles = async () => {
  try {
    console.log('🔄 Starting role migration...');
    
    // Connect to database
    const mongoURI = process.env.MONGODB_ATLAS_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/cultural-inclusion';
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to database');
    
    // Find users with old role names
    const oldRoleUsers = await User.find({
      role: { $in: ['data_entry', 'admin_user', 'user'] }
    });
    
    console.log(`📊 Found ${oldRoleUsers.length} users with old roles`);
    
    if (oldRoleUsers.length === 0) {
      console.log('✅ No users need migration');
      return;
    }
    
    // Migration mapping
    const roleMapping = {
      'data_entry': 'officer',
      'admin_user': 'admin', 
      'user': 'beneficiary'
    };
    
    let migratedCount = 0;
    
    for (const user of oldRoleUsers) {
      const oldRole = user.role;
      const newRole = roleMapping[oldRole];
      
      if (newRole) {
        user.role = newRole;
        
        // Set approval status based on role
        if (newRole === 'admin') {
          user.isApproved = true;
          user.approvalStatus = 'approved';
        } else if (newRole === 'officer') {
          user.isApproved = true;
          user.approvalStatus = 'approved';
        } else {
          // beneficiary - keep pending for admin approval
          user.isApproved = false;
          user.approvalStatus = 'pending';
        }
        
        await user.save();
        migratedCount++;
        
        console.log(`✅ Migrated user ${user.email}: ${oldRole} → ${newRole}`);
      }
    }
    
    console.log(`🎉 Migration complete! ${migratedCount} users migrated`);
    
    // Show current user roles
    const allUsers = await User.find({}, 'email role isApproved approvalStatus');
    console.log('\n📋 Current users:');
    allUsers.forEach(user => {
      console.log(`- ${user.email}: ${user.role} (Approved: ${user.isApproved}, Status: ${user.approvalStatus})`);
    });
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔄 Database connection closed');
  }
};

// Run migration if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  migrateRoles();
}

export default migrateRoles; 