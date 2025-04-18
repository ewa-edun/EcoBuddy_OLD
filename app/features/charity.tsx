import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Colors } from '../constants/Colors';
import { Package, Calendar, MapPin, HelpingHand, AlertCircle, Search, ArrowRight, Clock } from 'lucide-react-native';

// Mock data for charities
const charities = [
  {
    id: '1',
    name: 'Lagos Food Bank',
    category: 'Food & Clothing',
    description: 'Providing food and clothing to vulnerable communities in Lagos.',
    image: require('../../assets/user icon.png'),
    rating: 4.8,
    items: ['Clothing', 'Canned Food', 'Household Items'],
    location: 'Lagos Mainland',
    distance: '3.2 km',
  },
  {
    id: '2',
    name: 'Children\'s Education Fund',
    category: 'Education',
    description: 'Providing books and educational materials to underprivileged children.',
    image: require('../../assets/user icon.png'),
    rating: 4.6,
    items: ['Books', 'School Supplies', 'Electronics'],
    location: 'Ikeja',
    distance: '5.7 km',
  },
  {
    id: '3',
    name: 'Eco Warriors Nigeria',
    category: 'Environment',
    description: 'Recycling and upcycling materials to create sustainable products.',
    image: require('../../assets/user icon.png'),
    rating: 4.9,
    items: ['Plastics', 'Glass', 'Electronics', 'Paper'],
    location: 'Victoria Island',
    distance: '8.1 km',
  },
  {
    id: '4',
    name: 'Hope Shelter',
    category: 'Shelter & Housing',
    description: 'Providing housing and furniture to homeless individuals and families.',
    image: require('../../assets/user icon.png'),
    rating: 4.7,
    items: ['Furniture', 'Household Items', 'Clothing'],
    location: 'Yaba',
    distance: '4.3 km',
  },
];

// Mock data for recent donations
const recentDonations = [
  {
    id: '1',
    type: 'Electronics',
    date: '2 days ago',
    charity: 'Eco Warriors Nigeria',
    points: 320,
  },
  {
    id: '2',
    type: 'Clothing',
    date: '1 week ago',
    charity: 'Lagos Food Bank',
    points: 150,
  },
];

// Mock data for upcoming donation pickups
const upcomingPickups = [
  {
    id: '1',
    date: 'Tomorrow, 10:00 AM',
    charity: 'Children\'s Education Fund',
    items: 'Books and School Supplies',
    status: 'Confirmed',
  },
];

const CharityScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Clothing', 'Food', 'Books', 'Electronics', 'Furniture'];
  
  const filteredCharities = charities.filter(charity => {
    // Filter based on search query
    const matchesSearch = searchQuery === '' || 
      charity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      charity.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      charity.items.some(item => item.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Filter based on selected category
    const matchesCategory = selectedCategory === 'All' || 
      charity.items.some(item => item.includes(selectedCategory)) ||
      charity.category.includes(selectedCategory);
    
    return matchesSearch && matchesCategory;
  });

  const handleDonate = (charity: { name: string }) => {
    Alert.alert(
      "Schedule Donation",
      `Schedule a pickup for your donation to ${charity.name}`,
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Schedule", 
          onPress: () => Alert.alert("Success", "Your donation has been scheduled. A representative will contact you to arrange pickup details.")
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Donate Items</Text>
        <Text style={styles.subtitle}>Help reduce landfill waste by donating your used items</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Search size={20} color={Colors.accent.darkGray} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for charities or items"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Categories */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={styles.categoriesContainer}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              selectedCategory === category && styles.selectedCategoryButton
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text 
              style={[
                styles.categoryText,
                selectedCategory === category && styles.selectedCategoryText
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Upcoming Pickups */}
      {upcomingPickups.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming Pickups</Text>
          {upcomingPickups.map((pickup) => (
            <View key={pickup.id} style={styles.pickupCard}>
              <View style={styles.pickupIconContainer}>
                <Calendar size={24} color={Colors.primary.green} />
              </View>
              <View style={styles.pickupInfo}>
                <Text style={styles.pickupDate}>{pickup.date}</Text>
                <Text style={styles.pickupCharity}>{pickup.charity}</Text>
                <Text style={styles.pickupItems}>{pickup.items}</Text>
              </View>
              <View style={styles.pickupStatusContainer}>
                <Text style={styles.pickupStatus}>{pickup.status}</Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Recent Donations */}
      {recentDonations.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Donations</Text>
          {recentDonations.map((donation) => (
            <View key={donation.id} style={styles.donationCard}>
              <View style={styles.donationIconContainer}>
                <Package size={24} color={Colors.primary.blue} />
              </View>
              <View style={styles.donationInfo}>
                <Text style={styles.donationType}>{donation.type}</Text>
                <Text style={styles.donationCharity}>{donation.charity}</Text>
                <Text style={styles.donationDate}>{donation.date}</Text>
              </View>
              <View style={styles.donationPoints}>
                <Text style={styles.pointsValue}>+{donation.points}</Text>
                <Text style={styles.pointsLabel}>points</Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Available Charities */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Available Charities</Text>
        {filteredCharities.length > 0 ? (
          filteredCharities.map((charity) => (
            <View key={charity.id} style={styles.charityCard}>
              <Image source={charity.image} style={styles.charityImage} />
              <View style={styles.charityInfo}>
                <Text style={styles.charityName}>{charity.name}</Text>
                <Text style={styles.charityCategory}>{charity.category}</Text>
                <Text style={styles.charityDescription} numberOfLines={2}>
                  {charity.description}
                </Text>
                <View style={styles.locationContainer}>
                  <MapPin size={14} color={Colors.accent.darkGray} />
                  <Text style={styles.locationText}>{charity.location} • {charity.distance}</Text>
                </View>
                <View style={styles.itemsContainer}>
                  <Text style={styles.itemsLabel}>Accepts: </Text>
                  <Text style={styles.itemsList} numberOfLines={1}>
                    {charity.items.join(', ')}
                  </Text>
                </View>
                <TouchableOpacity 
                  style={styles.donateButton}
                  onPress={() => handleDonate(charity)}
                >
                  <Text style={styles.donateButtonText}>Donate Items</Text>
                  <ArrowRight size={16} color={Colors.secondary.white} />
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.noResultsContainer}>
            <AlertCircle size={60} color={Colors.primary.green} />
            <Text style={styles.noResultsText}>No charities found matching your search</Text>
            <Text style={styles.noResultsSubtext}>Try a different search term or category</Text>
          </View>
        )}
      </View>

      {/* Facts section */}
      <View style={styles.factsContainer}>
        <Text style={styles.factsTitle}>Did You Know?</Text>
        <Text style={styles.factsText}>
          Donating your used items can reduce landfill waste by up to 30%. Last year, EcoBuddy users helped divert over 15 tonnes of items from landfills through donations.
        </Text>
      </View>

      {/* Need help section */}
      <View style={styles.helpContainer}>
        <View style={styles.helpIconContainer}>
          <HelpingHand size={32} color={Colors.primary.green} />
        </View>
        <View style={styles.helpContent}>
          <Text style={styles.helpTitle}>Need a pickup?</Text>
          <Text style={styles.helpText}>
            For large items or bulk donations, we can arrange a pickup from your location at a convenient time.
          </Text>
          <TouchableOpacity 
            style={styles.helpButton}
            onPress={() => Alert.alert("Coming Soon", "This feature will be available in the next update!")}
          >
            <Text style={styles.helpButtonText}>Schedule Pickup</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.main,
  },
  header: {
    padding: 24,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontFamily: 'PlusJakartaSans-Bold',
    color: Colors.primary.green,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Regular',
    color: Colors.text.secondary,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary.cream,
    borderRadius: 12,
    marginHorizontal: 24,
    paddingHorizontal: 16,
    height: 50,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'PlusJakartaSans-Regular',
    color: Colors.accent.darkGray,
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.background.modal,
    marginRight: 10,
  },
  selectedCategoryButton: {
    backgroundColor: Colors.primary.green,
  },
  categoryText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Medium',
    color: Colors.accent.darkGray,
  },
  selectedCategoryText: {
    color: Colors.secondary.white,
  },
  section: {
    padding: 24,
    paddingTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'PlusJakartaSans-SemiBold',
    color: Colors.secondary.white,
    marginBottom: 16,
  },
  pickupCard: {
    flexDirection: 'row',
    backgroundColor: Colors.primary.cream,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  pickupIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary.green + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  pickupInfo: {
    flex: 1,
  },
  pickupDate: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-SemiBold',
    color: Colors.accent.darkGray,
    marginBottom: 4,
  },
  pickupCharity: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Medium',
    color: Colors.primary.green,
    marginBottom: 4,
  },
  pickupItems: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Regular',
    color: Colors.text.darker,
  },
  pickupStatusContainer: {
    backgroundColor: Colors.primary.green + '20',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  pickupStatus: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans-Medium',
    color: Colors.primary.green,
  },
  donationCard: {
    flexDirection: 'row',
    backgroundColor: Colors.primary.cream,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  donationIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary.blue + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  donationInfo: {
    flex: 1,
  },
  donationType: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-SemiBold',
    color: Colors.accent.darkGray,
    marginBottom: 4,
  },
  donationCharity: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Medium',
    color: Colors.primary.blue,
    marginBottom: 4,
  },
  donationDate: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Regular',
    color: Colors.text.darker,
  },
  donationPoints: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pointsValue: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Bold',
    color: Colors.secondary.yellow,
  },
  pointsLabel: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans-Regular',
    color: Colors.accent.darkGray,
  },
  charityCard: {
    flexDirection: 'row',
    backgroundColor: Colors.primary.cream,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  charityImage: {
    width: 100,
    height: '100%',
  },
  charityInfo: {
    flex: 1,
    padding: 16,
  },
  charityName: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-SemiBold',
    color: Colors.accent.darkGray,
    marginBottom: 4,
  },
  charityCategory: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Medium',
    color: Colors.primary.green,
    marginBottom: 6,
  },
  charityDescription: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Regular',
    color: Colors.text.darker,
    marginBottom: 8,
    lineHeight: 18,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationText: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans-Regular',
    color: Colors.accent.darkGray,
    marginLeft: 4,
  },
  itemsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  itemsLabel: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans-Medium',
    color: Colors.text.darker,
  },
  itemsList: {
    flex: 1,
    fontSize: 12,
    fontFamily: 'PlusJakartaSans-Regular',
    color: Colors.text.darker,
  },
  donateButton: {
    flexDirection: 'row',
    backgroundColor: Colors.primary.green,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
  },
  donateButtonText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Medium',
    color: Colors.secondary.white,
    marginRight: 8,
  },
  noResultsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
  },
  noResultsText: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-SemiBold',
    color: Colors.primary.green,
    marginTop: 16,
    marginBottom: 8,
  },
  noResultsSubtext: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Regular',
    color: Colors.text.darker,
    textAlign: 'center',
  },
  factsContainer: {
    backgroundColor: Colors.primary.green + '15',
    padding: 20,
    marginHorizontal: 24,
    borderRadius: 12,
    marginBottom: 24,
  },
  factsTitle: {
    fontSize: 18,
    fontFamily: 'PlusJakartaSans-SemiBold',
    color: Colors.primary.green,
    marginBottom: 8,
  },
  factsText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Regular',
    color: Colors.text.darker,
    lineHeight: 20,
  },
  helpContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.background.modal,
    padding: 20,
    marginHorizontal: 24,
    marginBottom: 40,
    borderRadius: 12,
  },
  helpIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary.green + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  helpContent: {
    flex: 1,
  },
  helpTitle: {
    fontSize: 18,
    fontFamily: 'PlusJakartaSans-SemiBold',
    color: Colors.secondary.white,
    marginBottom: 8,
  },
  helpText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Regular',
    color: Colors.text.secondary,
    marginBottom: 12,
    lineHeight: 20,
  },
  helpButton: {
    backgroundColor: Colors.primary.green,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  helpButtonText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Medium',
    color: Colors.secondary.white,
  },
});

export default CharityScreen;