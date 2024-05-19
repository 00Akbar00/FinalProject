import {
  StyleSheet,
  StatusBar,
  View,
  TouchableOpacity,
  Text,
  Image,
  FlatList,
  RefreshControl,
  ScrollView,
} from "react-native";
import { Ionicons } from "react-native-vector-icons";
import React, { useEffect, useState } from "react";
import cartIcon from "../../assets/icons/cart_beg.png";
import scanIcon from "../../assets/icons/scan_icons.png";
import easybuylogo from "../../assets/logo/logo.png";
import { colors } from "../../constants";
import CustomIconButton from "../../components/CustomIconButton/CustomIconButton";
import ProductCard from "../../components/ProductCard/ProductCard";
import { network } from "../../constants";
import { useSelector, useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import * as actionCreaters from "../../states/actionCreaters/actionCreaters";
import SearchableDropdown from "react-native-searchable-dropdown";
import { SliderBox } from "react-native-image-slider-box";
import SofaLine from '../../assets/icons/sofa-line.png'
import Chairs from '../../assets/icons/chair.png'
import Stools from '../../assets/icons/stool.png'
import Tables from '../../assets/icons/table.png'
import SofaBanner from '../../assets/image/banners/sofa-banner.jpeg'
import Contrast from '../../assets/image/banners/contrast.jpeg'
import ChairBanner from '../../assets/image/banners/chair.jpeg'


const category = [
  {
    _id: "62fe244f58f7aa8230817f89",
    title: "Sofas",
    image: SofaLine,
  },
  {
    _id: "62fe243858f7aa8230817f86",
    title: "Chairs",
    image: Chairs,
  },
  {
    _id: "62fe241958f7aa8230817f83",
    title: "Stools",
    image: Stools,
  },
  {
    _id: "62fe246858f7aa8230817f8c",
    title: "Tables",
    image: Tables,
  },
];

const slides = [
  SofaBanner,
  Contrast,
  ChairBanner,
];

const HomeScreen = ({ navigation, route }) => {
  const cartproduct = useSelector((state) => state.product);
  const dispatch = useDispatch();

  const { addCartItem } = bindActionCreators(actionCreaters, dispatch);

  const { user } = route.params;
  const [products, setProducts] = useState([]);
  const [refeshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [userInfo, setUserInfo] = useState({});
  const [searchItems, setSearchItems] = useState([]);

  //method to convert the authUser to json object
  const convertToJSON = (obj) => {
    try {
      setUserInfo(JSON.parse(obj));
    } catch (e) {
      setUserInfo(obj);
    }
  };

  //method to navigate to product detail screen of a specific product
  const handleProductPress = (product) => {
    navigation.navigate("productdetail", { product: product });
  };

  //method to add to cart (redux)
  const handleAddToCat = (product) => {
    addCartItem(product);
  };

  var headerOptions = {
    method: "GET",
    redirect: "follow",
  };

  const fetchProduct = () => {
    fetch(`${network.serverip}/products`, headerOptions) //API call
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          setProducts(result.data);
          setError("");
          let payload = [];
          result.data.forEach((cat, index) => {
            let searchableItem = { ...cat, id: ++index, name: cat.title };
            payload.push(searchableItem);
          });
          setSearchItems(payload);
        } else {
          setError(result.message);
        }
      })
      .catch((error) => {
        setError(error.message);
        console.log("error", error);
      });
  };

  //method call on pull refresh
  const handleOnRefresh = () => {
    setRefreshing(true);
    fetchProduct();
    setRefreshing(false);
  };

  //convert user to json and fetch products in initial render
  useEffect(() => {
    convertToJSON(user);
    fetchProduct();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar></StatusBar>
      <View style={styles.topBarContainer}>
        <TouchableOpacity disabled>
          <Ionicons name="menu" size={30} color={colors.muted} />
        </TouchableOpacity>
        <View style={styles.topbarlogoContainer}>
          <Image source={easybuylogo} style={styles.logo} />
          <Text style={styles.toBarText}>AR store</Text>
        </View>
        <TouchableOpacity
          style={styles.cartIconContainer}
          onPress={() => navigation.navigate("cart")}
        >
          {cartproduct.length > 0 ? (
            <View style={styles.cartItemCountContainer}>
              <Text style={styles.cartItemCountText}>{cartproduct.length}</Text>
            </View>
          ) : (
            <></>
          )}
          <Image source={cartIcon} />
        </TouchableOpacity>
      </View>
      <View style={styles.bodyContainer}>
        <View style={styles.searchContainer}>
          <View style={styles.inputContainer}>
            <SearchableDropdown
              onTextChange={(text) => console.log(text)}
              onItemSelect={(item) => handleProductPress(item)}
              defaultIndex={0}
              containerStyle={{
                borderRadius: 5,
                width: "100%",
                elevation: 5,
                position: "absolute",
                zIndex: 20,
                top: -20,
                maxHeight: 300,
                backgroundColor: colors.light,
              }}
              textInputStyle={{
                borderRadius: 10,
                padding: 6,
                paddingLeft: 10,
                borderWidth: 0,
                backgroundColor: colors.white,
              }}
              itemStyle={{
                padding: 10,
                marginTop: 2,
                backgroundColor: colors.white,
                borderColor: colors.muted,
              }}
              itemTextStyle={{
                color: colors.muted,
              }}
              itemsContainerStyle={{
                maxHeight: "100%",
              }}
              items={searchItems}
              placeholder="Search..."
              resetValue={false}
              underlineColorAndroid="transparent"
            />
            {/* <CustomInput radius={5} placeholder={"Search...."} /> */}
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.scanButton}>
              <Text style={styles.scanButtonText}>Scan</Text>
              <Image source={scanIcon} style={{ width: 20, height: 20 }} />
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView nestedScrollEnabled={true}>
          <View style={styles.promotiomSliderContainer}>
            <SliderBox
              images={slides}
              sliderBoxHeight={140}
              dotColor={colors.primary}
              inactiveDotColor={colors.muted}
              paginationBoxVerticalPadding={10}
              autoplayInterval={6000}
            />
          </View>
          <View style={styles.primaryTextContainer}>
            <Text style={styles.primaryText}>Categories</Text>
          </View>
          <View style={styles.categoryContainer}>
            <FlatList
              showsHorizontalScrollIndicator={false}
              style={styles.flatListContainer}
              horizontal={true}
              data={category}
              keyExtractor={(item, index) => `${item}-${index}`}
              renderItem={({ item, index }) => (
                <View style={{ marginBottom: 10 }} key={index}>
                  <CustomIconButton
                    key={index}
                    text={item.title}
                    image={item.image}
                    onPress={() =>
                      navigation.jumpTo("categories", { categoryID: item })
                    }
                  />
                </View>
              )}
            />
            <View style={styles.emptyView}></View>
          </View>
          <View style={styles.primaryTextContainer}>
            <Text style={styles.primaryText}>New Arrivals</Text>
          </View>
          {products.length === 0 ? (
            <View style={styles.productCardContainerEmpty}>
              <Text style={styles.productCardContainerEmptyText}>
                No Product
              </Text>
            </View>
          ) : (
            <View style={styles.productCardContainer}>
              <FlatList
                refreshControl={
                  <RefreshControl
                    refreshing={refeshing}
                    onRefresh={handleOnRefresh}
                  />
                }
                showsHorizontalScrollIndicator={false}
                initialNumToRender={5}
                horizontal={true}
                data={products.slice(0, 4)}
                keyExtractor={(item) => item._id}
                renderItem={({ item, index }) => (
                  <View
                    key={item._id}
                    style={{ marginLeft: 5, marginBottom: 10, marginRight: 5 }}
                  >
                    <ProductCard
                      name={item.title}
                      image={`${network.serverip}/uploads/${item.image}`}
                      price={item.price}
                      quantity={item.quantity}
                      onPress={() => handleProductPress(item)}
                      onPressSecondary={() => handleAddToCat(item)}
                    />
                  </View>
                )}
              />
              <View style={styles.emptyView}></View>
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

export default HomeScreen;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topBarContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: colors.light,
  },
  topbarlogoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    height: 50,
    width: 50,
    resizeMode: "contain",
    marginRight: 10,
  },
  toBarText: {
    fontSize: 20,
    fontWeight: "bold",
    color: '#252422',
  },
  cartIconContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  cartItemCountContainer: {
    position: "absolute",
    top: -10,
    left: 10,
    backgroundColor: colors.primary,
    borderRadius: 11,
    padding: 4,
  },
  cartItemCountText: {
    color: colors.light,
    fontSize: 12,
    fontWeight: "bold",
  },
  bodyContainer: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    marginTop: 10,
  },
  inputContainer: {
    flex: 1,
    marginRight: 10,
  },
  buttonContainer: {
    marginLeft: 10,
    marginRight: 10,
  },
  scanButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primary,
    borderRadius: 10,
    height: 40,
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  scanButtonText: {
    fontSize: 16,
    color: colors.light,
    fontWeight: "bold",
  },
  promotiomSliderContainer: {
    marginVertical: 20,
    backgroundColor: colors.light,
  },
  primaryTextContainer: {
    paddingHorizontal: 20,
    fontSize: 20,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 10,
  },
  categoryContainer: {
    flexDirection: "row",
    marginRight: 10,
  },
  emptyView: {
    height: 20,
  },
  productCardContainerEmpty: {
    padding: 20,
    alignItems: "center",
  },
  productCardContainerEmptyText: {
    fontSize: 18,
    fontStyle: "italic",
    color: colors.muted,
    fontWeight: "600",
    textAlign: "center",
  },
});