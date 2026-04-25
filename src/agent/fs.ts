import fs from "node:fs/promises";

export async function removeLocalArtifact(
  artifactPath: string,
  options?: Parameters<typeof fs.rm>[1]
) {
  try {
    await fs.rm(artifactPath, { force: true, ...options });
    console.log(`Deleted local artifact: ${artifactPath}`);
  } catch (error) {
    console.error(`Failed to delete local artifact: ${artifactPath}`, error);
  }
}
