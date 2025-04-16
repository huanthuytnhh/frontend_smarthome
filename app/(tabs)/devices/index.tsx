import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import {
  Lightbulb,
  Fan,
  Tv,
  Lock,
  Power,
  Wifi,
  Mic, // Keep Mic if used elsewhere, remove if only for voice button
  Plus,
  Trash2,
  // LucideIcon, // Removed as it's not used
} from 'lucide-react-native';
import { useState, useEffect } from 'react'; // Keep useState, useEffect
import { useRouter } from 'expo-router';
import { getPermissionsByMember } from '../../../services/permissionApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { controlDevice } from '../../../services/deviceApi';
import { formatDistanceToNow } from 'date-fns';
// import * as Speech from 'expo-speech'; // Remove Speech import
// import Voice from '@react-native-voice/voice'; // Remove Voice import

// Define the structure for the permission object
interface Permission {
  device: {
    id: string;
    name: string;
    status: boolean;
    device_type: string;
    room: string;
    last_updated: string; // Assuming string based on new Date() usage
  };
  can_control: boolean;
}

export default function DevicesScreen() {
  interface Device {
    id: string;
    name: string;
    icon: React.ComponentType<{ size: number; color: string }>; // Reverted to original type
    isOn: boolean;
    type: string;
    room: string;
    lastUsed: string;
    canControl: boolean;
  }

  const [devices, setDevices] = useState<Device[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  // Remove voice-related state variables
  // const [voiceResult, setVoiceResult] = useState('');
  // const [isListening, setIsListening] = useState(false);
  // const [isVoiceAvailable, setIsVoiceAvailable] = useState(false);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const memberId = await AsyncStorage.getItem('memberId'); // Retrieve memberId from AsyncStorage
        if (!memberId) {
          console.error('Member ID not found');
          return;
        }
        const permissions: Permission[] = await getPermissionsByMember(
          memberId
        ); // Add type annotation for permissions array
        const devicesWithPermissions = permissions.map(
          (permission: Permission) => ({
            // Add type annotation for permission parameter
            id: permission.device.id,
            name: permission.device.name,
            // Cast the icon to the expected type to satisfy TypeScript
            icon: Lightbulb as React.ComponentType<{
              size: number;
              color: string;
            }>,
            isOn: permission.device.status,
            type: permission.device.device_type,
            room: permission.device.room,
            lastUsed: formatDistanceToNow(
              new Date(permission.device.last_updated),
              { addSuffix: true }
            ),
            canControl: permission.can_control,
          })
        );
        setDevices(devicesWithPermissions);
      } catch (error) {
        console.error('Error fetching devices:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDevices();

    // Remove voice availability check
  }, []);

  const handleDeviceToggle = async (device: Device) => {
    // Added type annotation for device
    console.log('Toggling device:', device);
    if (!device.canControl) {
      console.warn('You do not have permission to control this device.');
      // Optionally, show a user-friendly message here
      return; // Prevent further execution if no permission
    }
    try {
      const action = device.isOn ? 'turn_off' : 'turn_on'; // Determine the action
      const updatedDevice = await controlDevice(device.id, action); // Call the control API
      console.log('Device toggled successfully:', updatedDevice);
      setDevices((prevDevices) =>
        prevDevices.map((d) =>
          d.id === device.id ? { ...d, isOn: updatedDevice.status } : d
        )
      );
    } catch (error) {
      console.error('Error toggling device:', error);
      // Optionally, show a user-friendly error message here
    }
  };

  // Remove voice-related functions: startListening, stopListening, processVoiceCommand

  // Remove useEffect hook for voice listeners

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading devices...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>My Devices</Text>
          {/* Add button removed as it wasn't used in the original code */}
        </View>

        <View style={styles.deviceGrid}>
          {devices.map((device) => {
            // Dynamically select icon based on device type (example)
            let DeviceIcon = Lightbulb; // Default icon
            if (device.type.toLowerCase().includes('fan')) {
              DeviceIcon = Fan;
            } else if (device.type.toLowerCase().includes('tv')) {
              DeviceIcon = Tv;
            } // Add more conditions for other device types

            return (
              <TouchableOpacity
                key={device.id}
                style={styles.deviceCard}
                onPress={() => handleDeviceToggle(device)}
                disabled={!device.canControl} // Disable button if no control permission
              >
                <View
                  style={[
                    styles.iconContainer,
                    device.isOn && styles.iconContainerActive,
                    !device.canControl && styles.iconContainerDisabled, // Style for disabled state
                  ]}
                >
                  <DeviceIcon
                    size={24}
                    color={
                      device.isOn
                        ? '#ffffff'
                        : device.canControl
                        ? '#8E8E93'
                        : '#cccccc'
                    } // Dim color if disabled
                  />
                </View>
                <Text
                  style={[
                    styles.deviceName,
                    !device.canControl && styles.textDisabled,
                  ]}
                >
                  {device.name}
                </Text>
                <Text
                  style={[
                    styles.deviceType,
                    !device.canControl && styles.textDisabled,
                  ]}
                >
                  {device.type}
                </Text>
                <Text
                  style={[
                    styles.deviceRoom,
                    !device.canControl && styles.textDisabled,
                  ]}
                >
                  {device.room}
                </Text>
                <Text
                  style={[
                    styles.lastUsed,
                    !device.canControl && styles.textDisabled,
                  ]}
                >
                  {device.lastUsed}
                </Text>
                {!device.canControl && ( // Show lock icon if cannot control
                  <View style={styles.lockIconContainer}>
                    <Lock size={16} color="#FF3B30" />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Remove voice button */}
      {/* Modal related code removed as it wasn't used */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60, // Adjusted for potential notch/status bar
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold', // Changed from 700
    color: '#000000',
  },
  // Removed addButton styles as the button was removed
  deviceGrid: {
    padding: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between', // Ensures space between cards
    gap: 15, // Adds gap between cards instead of relying on width %
  },
  deviceCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    // Removed marginBottom, using gap in grid instead
    width: '48%', // Keeps two cards per row approx. Adjust if needed with gap
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    position: 'relative', // Needed for absolute positioning of lock icon
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E5E5EA', // Slightly darker grey
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainerActive: {
    backgroundColor: '#007AFF',
  },
  iconContainerDisabled: {
    backgroundColor: '#F2F2F7', // Lighter grey for disabled
  },
  deviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  deviceType: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 4,
  },
  deviceRoom: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 4,
  },
  lastUsed: {
    fontSize: 12,
    color: '#AEAEB2', // Slightly lighter grey
    fontStyle: 'italic',
    marginTop: 8, // Add some space above last used
  },
  textDisabled: {
    color: '#cccccc', // Dim text color for disabled cards
  },
  lockIconContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Slight background for visibility
    borderRadius: 10,
    padding: 2,
  },
  // Removed powerButton styles as it wasn't used
  // Remove voiceButton styles
  // voiceButton: { ... },
  // voiceButtonActive: { ... },
  // Removed modal styles as the modal was removed
});
