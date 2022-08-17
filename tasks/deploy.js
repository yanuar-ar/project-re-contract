const { task } = require('hardhat/config');
const fs = require('fs');

task('deploy', 'Deploy contract').setAction(async ({}, { ethers }) => {
  const ProjectRe = await ethers.getContractFactory('ProjectRe');
  const projectRe = await ProjectRe.deploy({ gasLimit: 3000000 });

  await projectRe.deployed();

  console.log('NFT contract deployed to: ', projectRe.address);

  fs.writeFileSync(
    'tasks/config.json',
    JSON.stringify({ projectContractAddress: projectRe.address }),
  );
});
