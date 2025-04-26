import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, TextInput, Alert, FlatList } from 'react-native';
import { Colors } from '../constants/Colors';
import { MapPin, Recycle, User, Phone, Calendar, ArrowRight, AlertCircle, FileText, Scale, TrendingUp, Smile, Search } from 'lucide-react-native';

// Mock data for kiosk locations
const kioskLocations = [
  {
    id: '1',
    name: 'Yaba Recycling Hub',
    address: '23 Herbert Macaulay Way, Yaba',
    city: 'Lagos',
    distance: '1.2 km',
    operatingHours: '9:00 AM - 5:00 PM',
    image: require('../../assets/user icon.png'),
    materialsAccepted: ['Plastic', 'Paper', 'Glass', 'Metal'],
    agentName: 'Ibrahim Olatunji',
    agentPhone: '+234 812 345 6789',
  },
  {
    id: '2',
    name: 'Ikeja Collection Center',
    address: '45 Allen Avenue, Ikeja',
    city: 'Lagos',
    distance: '3.4 km',
    operatingHours: '8:00 AM - 6:00 PM',
    image: require('../../assets/user icon.png'),
    materialsAccepted: ['Plastic', 'Metal', 'Electronics'],
    agentName: 'Amina Mohammed',
    agentPhone: '+234 809 876 5432',
  },
  {
    id: '3',
    name: 'Surulere Recycling Station',
    address: '78 Adeniran Ogunsanya St, Surulere',
    city: 'Lagos',
    distance: '5.6 km',
    operatingHours: '10:00 AM - 4:00 PM',
    image: require('../../assets/user icon.png'),
    materialsAccepted: ['Plastic', 'Paper', 'Glass'],
    agentName: 'Chukwudi Okonkwo',
    agentPhone: '+234 703 456 7890',
  },
  {
    id: '4',
    name: 'Victoria Island Collection Point',
    address: '12 Adetokunbo Ademola St, Victoria Island',
    city: 'Lagos',
    distance: '8.9 km',
    operatingHours: '9:00 AM - 5:00 PM',
    image: require('../../assets/user icon.png'),
    materialsAccepted: ['Plastic', 'Paper', 'Electronics', 'Metal'],
    agentName: 'Fatima Abubakar',
    agentPhone: '+234 814 567 8901',
  },
];

// Mock data for upcoming drop-offs
const upcomingDropoffs = [
  {
    id: '1',
    location: 'Yaba Recycling Hub',
    date: 'Tomorrow, 2:00 PM',
    materials: 'Plastic bottles, Newspapers',
    status: 'Confirmed',
  },
];

// Mock data for past transactions
const pastTransactions = [
  {
    id: '1',
    location: 'Ikeja Collection Center',
    date: '15 Feb 2025',
    materials: 'Plastic bottles',
    weight: '3.2 kg',
    points: 112,
  },
  {
    id: '2',
    location: 'Yaba Recycling Hub',
    date: '2 Feb 2025',
    materials: 'Metal cans, Glass bottles',
    weight: '4.7 kg, 2.3 kg',
    points: 420,
  },
];

const KioskScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('findKiosk'); // findKiosk, becomeAgent

  const filteredKiosks = kioskLocations.filter(kiosk => 
    kiosk.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    kiosk.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
    kiosk.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderKioskItem = ({ item }: { item: typeof kioskLocations[0] }) => (
    <TouchableOpacity 
      style={styles.kioskCard}
      onPress={() => handleViewKiosk(item)}
    >
      <View style={styles.kioskHeader}>
        <Image source={item.image} style={styles.kioskImage} />
        <View style={styles.kioskInfo}>
          <Text style={styles.kioskName}>{item.name}</Text>
          <View style={styles.locationRow}>
            <MapPin size={14} color={Colors.accent.darkGray} />
            <Text style={styles.locationText}>{item.address}</Text>
          </View>
          <Text style={styles.distanceText}>{item.distance} away</Text>
        </View>
      </View>
      
      <View style={styles.materialsContainer}>
        <Text style={styles.materialsTitle}>Materials Accepted:</Text>
        <View style={styles.materialTags}>
          {item.materialsAccepted.map((material, index) => (
            <View key={`${item.id}-${material}`}  style={styles.materialTag}>
              <Text style={styles.materialTagText}>{material}</Text>
            </View>
          ))}
        </View>
      </View>
      
      <View style={styles.kioskFooter}>
        <View style={styles.hoursContainer}>
          <Calendar size={14} color={Colors.primary.green} />
          <Text style={styles.hoursText}>{item.operatingHours}</Text>
        </View>
        <TouchableOpacity 
          style={styles.scheduleButton}
          onPress={() => handleScheduleDropoff(item)}
        >
          <Text style={styles.scheduleButtonText}>Schedule Drop-off</Text>
          <ArrowRight size={16} color={Colors.secondary.white} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const handleViewKiosk = (kiosk: typeof kioskLocations[0]) => {
    Alert.alert(
      kiosk.name,
      `Agent: ${kiosk.agentName}\nPhone: ${kiosk.agentPhone}\n\nOperating Hours: ${kiosk.operatingHours}`
    );
  };

  const handleScheduleDropoff = (kiosk: typeof kioskLocations[0]) => {
    Alert.alert(
      "Schedule Drop-off",
      `Would you like to schedule a drop-off at ${kiosk.name}?`,
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Schedule", 
          onPress: () => Alert.alert("Success", "Your drop-off has been scheduled. Remember to bring your recyclables on the scheduled date.")
        }
      ]
    );
  };

  const handleAgentRegistration = () => {
    Alert.alert(
      "Become an Agent",
      "Thank you for your interest in becoming a recycling agent. Our team will reach out to you with more information.",
      [
        { 
          text: "OK", 
          onPress: () => setSelectedTab('findKiosk')
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
 {/* Disclaimer Section */}
   <View style={styles.disclaimerContainer}>
      <AlertCircle size={20} color="#D32F2F" style={styles.disclaimerIcon} />
      <Text style={styles.disclaimerText}>
        This page will be fully functional in the next main update. What you see below is a sneak peak of how it will look like 😉
      </Text>
    </View>

      <View style={styles.header}>
        <Text style={styles.title}>Mobile Kiosk</Text>
        <Text style={styles.subtitle}>Find local recycling agents or join as a collector</Text>
      </View>

      {/* Tab Selection */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, selectedTab === 'findKiosk' && styles.activeTab]} 
          onPress={() => setSelectedTab('findKiosk')}
        >
          <MapPin size={18} color={selectedTab === 'findKiosk' ? Colors.secondary.white : Colors.text.darker} />
          <Text style={[styles.tabText, selectedTab === 'findKiosk' && styles.activeTabText]}>Find Kiosk</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, selectedTab === 'becomeAgent' && styles.activeTab]} 
          onPress={() => setSelectedTab('becomeAgent')}
        >
          <Smile size={18} color={selectedTab === 'becomeAgent' ? Colors.secondary.white : Colors.text.darker} />
          <Text style={[styles.tabText, selectedTab === 'becomeAgent' && styles.activeTabText]}>Become Agent</Text>
        </TouchableOpacity>
      </View>

      {/* Find Kiosk Content */}
      {selectedTab === 'findKiosk' && (
        <>
          {/* Search Bar */}
          <View style={styles.searchContainer}>
          <Search size={20} color={Colors.accent.darkGray} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search for kiosks by location"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* Upcoming Drop-offs */}
          {upcomingDropoffs.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Upcoming Drop-offs</Text>
              {upcomingDropoffs.map((dropoff) => (
                <View key={dropoff.id} style={styles.dropoffCard}>
                  <View style={styles.dropoffIconContainer}>
                    <Calendar size={24} color={Colors.primary.green} />
                  </View>
                  <View style={styles.dropoffInfo}>
                    <Text style={styles.dropoffLocation}>{dropoff.location}</Text>
                    <Text style={styles.dropoffDate}>{dropoff.date}</Text>
                    <Text style={styles.dropoffMaterials}>{dropoff.materials}</Text>
                  </View>
                  <View style={styles.dropoffStatusContainer}>
                    <Text style={styles.dropoffStatus}>{dropoff.status}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Past Transactions */}
          {pastTransactions.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Transaction History</Text>
              {pastTransactions.map((transaction) => (
                <View key={transaction.id} style={styles.transactionCard}>
                  <View style={styles.transactionIconContainer}>
                    <Recycle size={24} color={Colors.primary.blue} />
                  </View>
                  <View style={styles.transactionInfo}>
                    <Text style={styles.transactionLocation}>{transaction.location}</Text>
                    <Text style={styles.transactionDate}>{transaction.date}</Text>
                    <Text style={styles.transactionMaterials}>{transaction.materials}</Text>
                    <View style={styles.weightContainer}>
                      <Scale size={14} color={Colors.accent.darkGray} />
                      <Text style={styles.transactionWeight}>{transaction.weight}</Text>
                    </View>
                  </View>
                  <View style={styles.transactionPoints}>
                    <Text style={styles.pointsValue}>+{transaction.points}</Text>
                    <Text style={styles.pointsLabel}>points</Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Kiosk Locations */}
          <View style={styles.section}>
         <Text style={styles.sectionTitle}>Kiosk Locations</Text>
         {filteredKiosks.length > 0 ? (
     filteredKiosks.map((kiosk) => (
     <TouchableOpacity 
        key={kiosk.id} // Add this key prop
        style={styles.kioskCard}
        onPress={() => handleViewKiosk(kiosk)}
      >
        {renderKioskItem({ item: kiosk })}
      </TouchableOpacity>
      ))
        ) : (
              <View style={styles.noResultsContainer}>
                <AlertCircle size={60} color={Colors.primary.green} />
                <Text style={styles.noResultsText}>No kiosks found</Text>
                <Text style={styles.noResultsSubtext}>Try a different search term</Text>
              </View>
            )}
          </View>
        </>
      )}

      {/* Become Agent Content */}
      {selectedTab === 'becomeAgent' && (
        <View style={styles.agentSection}>
          <View style={styles.agentInfoCard}>
            <View style={styles.agentIconContainer}>
              <Recycle size={36} color={Colors.primary.green} />
            </View>
            <Text style={styles.agentTitle}>Join as a Recycling Agent</Text>
            <Text style={styles.agentDescription}>
              Help strengthen local recycling ecosystems by becoming an agent. As an agent, you'll:
            </Text>
            
            <View style={styles.benefitItem}>
              <View style={styles.benefitIconContainer}>
                <FileText size={20} color={Colors.primary.green} />
              </View>
              <Text style={styles.benefitText}>Register users without internet access</Text>
            </View>
            
            <View style={styles.benefitItem}>
              <View style={styles.benefitIconContainer}>
                <Scale size={20} color={Colors.primary.green} />
              </View>
              <Text style={styles.benefitText}>Collect and weigh recyclable materials</Text>
            </View>
            
            <View style={styles.benefitItem}>
              <View style={styles.benefitIconContainer}>
                <TrendingUp size={20} color={Colors.primary.green} />
              </View>
              <Text style={styles.benefitText}>Earn commission on all collected materials</Text>
            </View>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>Agent Registration</Text>
            
            <View style={styles.inputContainer}>
              <User size={20} color={Colors.accent.darkGray} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Full Name"
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Phone size={20} color={Colors.accent.darkGray} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Phone Number"
                keyboardType="phone-pad"
              />
            </View>
            
            <View style={styles.inputContainer}>
              <MapPin size={20} color={Colors.accent.darkGray} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Business Address"
              />
            </View>
            
            <TouchableOpacity 
              style={styles.registerButton}
              onPress={handleAgentRegistration}
            >
              <Text style={styles.registerButtonText}>Submit Registration</Text>
            </TouchableOpacity>
          </View>
    </View>
      )}

      {/* Info Card */}
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>About Mobile Kiosks</Text>
        <Text style={styles.infoText}>
          Mobile Kiosks allow anyone to participate in recycling efforts even without internet access. Local scrap collectors (mallams) can register as agents to help collect recyclable materials from their communities.
        </Text>
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
    paddingTop: 20,
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
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 24,
    backgroundColor: Colors.background.modal,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 8,
  },
  activeTab: {
    backgroundColor: Colors.primary.green,
  },
  tabText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Medium',
    color: Colors.text.darker,
  },
  activeTabText: {
    color: Colors.secondary.white,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary.cream,
    borderRadius: 12,
    marginHorizontal: 24,
    paddingHorizontal: 16,
    height: 50,
    margin: 24,
    marginTop: 0,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    backgroundColor: Colors.primary.cream,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    fontFamily: 'PlusJakartaSans-Regular',
    color: Colors.accent.darkGray,
  },
  section: {
    padding: 24,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'PlusJakartaSans-SemiBold',
    color: Colors.secondary.white,
    marginBottom: 16,
  },
  kioskCard: {
    backgroundColor: Colors.primary.cream,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  kioskHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  kioskImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  kioskInfo: {
    flex: 1,
  },
  kioskName: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-SemiBold',
    color: Colors.accent.darkGray,
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  locationText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Regular',
    color: Colors.accent.darkGray,
    marginLeft: 6,
  },
  distanceText: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans-Regular',
    color: Colors.primary.blue,
  },
  materialsContainer: {
    marginBottom: 12,
  },
  materialsTitle: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Medium',
    color: Colors.accent.darkGray,
    marginBottom: 6,
  },
  materialTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  materialTag: {
    backgroundColor: Colors.primary.green + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 6,
  },
  materialTagText: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans-Medium',
    color: Colors.primary.green,
  },
  kioskFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  hoursContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hoursText: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans-Regular',
    color: Colors.accent.darkGray,
    marginRight: 3,
    marginLeft: 2,
  },
  scheduleButton: {
    flexDirection: 'row',
    backgroundColor: Colors.primary.green,
    paddingHorizontal: 7,
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: 'center',
  },
  scheduleButtonText: {
    fontSize: 11,
    fontFamily: 'PlusJakartaSans-Medium',
    color: Colors.secondary.white,
  },
  dropoffCard: {
    flexDirection: 'row',
    backgroundColor: Colors.primary.cream,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dropoffIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary.green + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  dropoffInfo: {
    flex: 1,
  },
  dropoffLocation: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-SemiBold',
    color: Colors.accent.darkGray,
    marginBottom: 4,
  },
  dropoffDate: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Medium',
    color: Colors.primary.blue,
    marginBottom: 4,
  },
  dropoffMaterials: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Regular',
    color: Colors.text.darker,
  },
  dropoffStatusContainer: {
    backgroundColor: Colors.primary.green + '20',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  dropoffStatus: {
    fontSize: 12,
    fontFamily: 'PlusJakartaSans-Medium',
    color: Colors.primary.green,
  },
  transactionCard: {
    flexDirection: 'row',
    backgroundColor: Colors.primary.cream,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  transactionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary.blue + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionLocation: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-SemiBold',
    color: Colors.accent.darkGray,
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Medium',
    color: Colors.primary.blue,
    marginBottom: 4,
  },
  transactionMaterials: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Regular',
    color: Colors.text.darker,
    marginBottom: 4,
  },
  weightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  transactionWeight: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Regular',
    color: Colors.accent.darkGray,
    marginLeft: 4,
  },
  transactionPoints: {
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
  agentSection: {
    padding: 24,
    paddingTop: 0,
  },
  agentInfoCard: {
    backgroundColor: Colors.primary.cream,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  agentIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.primary.green + '20',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 16,
  },
  agentTitle: {
    fontSize: 18,
    fontFamily: 'PlusJakartaSans-Bold',
    color: Colors.primary.green,
    textAlign: 'center',
    marginBottom: 12,
  },
  agentDescription: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Regular',
    color: Colors.accent.darkGray,
    marginBottom: 16,
    lineHeight: 20,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  benefitIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary.green + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  benefitText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Medium',
    color: Colors.accent.darkGray,
  },
  formContainer: {
    backgroundColor: Colors.background.modal,
    borderRadius: 12,
        padding: 20,
    },
  formTitle: {
    fontSize: 18,
    fontFamily: 'PlusJakartaSans-SemiBold',
    color: Colors.secondary.white,
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary.cream,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    height: 48,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'PlusJakartaSans-Regular',
    color: Colors.accent.darkGray,
  },
  registerButton: {
    backgroundColor: Colors.primary.green,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  registerButtonText: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-SemiBold',
    color: Colors.secondary.white,
  },
  infoCard: {
    backgroundColor: Colors.primary.blue + '15',
    padding: 20,
    margin: 24,
    marginTop: 0,
    borderRadius: 12,
    marginBottom: 40,
  },
  infoTitle: {
    fontSize: 18,
    fontFamily: 'PlusJakartaSans-SemiBold',
    color: Colors.primary.blue,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Regular',
    color: Colors.text.darker,
    lineHeight: 20,
  },
  disclaimerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary.red + 40, 
    padding: 12,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 8,
  },
  disclaimerIcon: {
    marginRight: 8,
  },
  disclaimerText: {
    color: Colors.primary.red, 
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Medium',
    flex: 1,
  },
});

export default KioskScreen;