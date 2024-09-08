import { Account, Client, Databases, Storage, ID, Query } from "appwrite";
import config from "../../config";

class Appwrite {
  client: Client;
  account: Account;
  databases: Databases;
  storage: Storage;
  databaseId: string;
  adminCollectionId: string;
  itemsCollectionId: string;

  constructor() {
    this.client = new Client()
      .setEndpoint("https://cloud.appwrite.io/v1")
      .setProject(config.projectId);
    this.account = new Account(this.client);
    this.databases = new Databases(this.client);
    this.storage = new Storage(this.client);
    this.databaseId = config.databaseId;
    this.adminCollectionId = config.adminCollectionId;
    this.itemsCollectionId = config.itemsCollectionId;
  }

  async login(email: string, password: string) {
    try {
      const session = await this.account.createEmailPasswordSession(
        email,
        password
      );
      return session;
    } catch (error) {
      console.error("Login failed", error);
      throw error;
    }
  }

  async logout() {
    try {
      const session = await this.account.getSession("current");
      return await this.account.deleteSession(session.$id);
    } catch (error) {
      window.alert(
        "An error occured during logout \nPlease check logs for details"
      );
      console.log(error);
    }
  }

  async checkAdminPrivileges(userId: string): Promise<any> {
    try {
      const doc: any = await this.databases.listDocuments(
        this.databaseId,
        this.adminCollectionId,
        [Query.contains("userId", userId)]
      );
      const isAdmin: boolean = doc.documents[0].isAdmin;
      return isAdmin === true;
    } catch (error) {
      console.error("Failed to check admin privileges", error);
      return false;
    }
  }

  async uploadItem(name: string, price: number, imageFile: File) {
    try {
      const storageRes = await this.storage.createFile(
        config.storageId,
        ID.unique(),
        imageFile
      );
      const dbResponse = await this.databases.createDocument(
        this.databaseId,
        this.itemsCollectionId,
        ID.unique(),
        { name, price, imageFile: storageRes.$id }
      );
      return dbResponse;
    } catch (error) {
      console.error("Failed to upload item", error);
      throw error;
    }
  }

  async getitems(): Promise<any[]> {
    try {
      const res = await this.databases.listDocuments(
        this.databaseId,
        this.itemsCollectionId
      );

      const itemsWithImages = await Promise.all(
        res.documents.map(async (item) => {
          try {
            const imageFile = await this.storage.getFilePreview(
              config.storageId,
              item.imageFile
            );
            return {
              name: item.name,
              price: item.price,
              image: imageFile.href,
            };
          } catch (error) {
            console.error(`Failed to fetch image for item ${item.$id}`, error);
            return null;
          }
        })
      );

      return itemsWithImages.filter((item) => item !== null);
    } catch (error) {
      console.log("Error fetching items:", error);
      throw error;
    }
  }
}

export const appwrite = new Appwrite();
