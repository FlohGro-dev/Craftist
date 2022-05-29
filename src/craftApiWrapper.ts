//import {} from '@craftdocs/craft-extension-api';


class CraftApiWrapper {
  public static openUrl(url: string) {
    craft.editorApi.openURL(url);
  }
}

export default CraftApiWrapper;